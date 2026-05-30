#!/usr/bin/env python3
"""Classify ShipFlow conversation transcripts into deterministic audit findings."""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any


UNSAFE_PATTERNS = (
    re.compile(r"\b(?:sk_live_|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[0-9a-zA-Z-]{10,})"),
    re.compile(r"\b(?:https?://)?(?:localhost|127\.0\.0\.1)(:\d+)?\b", re.IGNORECASE),
    re.compile(r"\bpassword\s*[:=]\s*\S+", re.IGNORECASE),
    re.compile(r"/home/[^\s]+/"),
)


CATEGORY_RULES = {
    "missed_action": [
        r"\breport(?:ing)?\b.*\binstead of\b.*\bfix",
        r"\brapport(?:e|er|ing)?\b.*\bne corrige\b",
        r"\bI (?:will|would) (?:analyse|diagnose|explain|investigate)\b.*\bbut not\b",
        r"\bcannot (?:fix|patch|edit)\b",
    ],
    "over_reporting": [
        r"\btoo much details?\b",
        r"\bverbose\b",
        r"\bextensive report\b",
        r"\brapport\b.*\bd[ée]taill[ée]\b",
        r"\btant de d[ée]tails\b",
    ],
    "wrong_owner_route": [
        r"\bthis is not.*(sf-|skill)\b",
        r"\broute to\b.*\b(unsupported|wrong|wrongly)\b",
    ],
    "literalism_over_intent": [
        r"\bliteral(?:ly)?\b.*\bcommand\b",
        r"\bfollow the prompt\b",
        r"\bexactly as written\b",
        r"\bexactement comme [ée]crit\b",
    ],
    "proof_gap": [
        r"\bno evidence\b",
        r"\bcannot verify\b",
        r"\bwithout proof\b",
    ],
    "stale_skill_contract": [
        r"\balready known\b.*\blegacy\b",
        r"\boutdated\b.*\bcontract\b",
    ],
    "bad_question": [
        r"\bwhy\b.*\bso many\b",
        r"\bpourquoi\b.*\btant de\b",
        r"\bdo we?\s*$",
        r"\bshould I.*\b",
    ],
    "user_friction": [
        r"\btoo long\b.*\bresponse\b",
        r"\bagain\b.*\bignore\b",
        r"\bnot helpful\b",
        r"\bslowing down\b",
    ],
    "unsafe_ship_or_dirty_scope": [
        r"\bprivate\b.*\blogs?\b",
        r"\blogs?\b.*\bprivate\b",
        r"\braw logs\b",
    ],
    "weak_follow_through": [
        r"\blet's defer\b",
        r"\bwe'll do this later\b",
        r"\bTODO\b",
    ],
}

CATEGORY_RE = {name: re.compile("|".join(patterns), re.IGNORECASE) for name, patterns in CATEGORY_RULES.items()}

OWNER_BY_CATEGORY = {
    "missed_action": "sf-build",
    "over_reporting": "sf-build",
    "wrong_owner_route": "sf-build",
    "literalism_over_intent": "sf-build",
    "proof_gap": "sf-verify",
    "stale_skill_contract": "sf-spec",
    "bad_question": "sf-build",
    "user_friction": "sf-build",
    "unsafe_ship_or_dirty_scope": "sf-spec",
    "weak_follow_through": "sf-build",
}


@dataclass
class Finding:
    category: str
    match: str
    excerpt: str

    def as_dict(self) -> dict[str, str]:
        return {
            "category": self.category,
            "match": self.match,
            "excerpt": self.excerpt,
        }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", help="Markdown transcript path")
    parser.add_argument("--fixtures", action="store_true", help="Emit normalized fixtures for deterministic tests")
    return parser.parse_args()


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def is_unsafe(text: str) -> bool:
    return any(pattern.search(text) for pattern in UNSAFE_PATTERNS)


def classify(text: str) -> list[Finding]:
    findings: list[Finding] = []
    for category, regex in CATEGORY_RE.items():
        match = regex.search(text)
        if not match:
            continue
        excerpt_start = max(0, match.start() - 36)
        excerpt_end = min(len(text), match.end() + 36)
        findings.append(
            Finding(
                category=category,
                match=match.group(0),
                excerpt=text[excerpt_start:excerpt_end].replace("\n", " ").strip(),
            )
        )
    return findings


def main() -> int:
    args = parse_args()
    path = Path(args.path)
    if not path.exists():
        print(f"missing-path: {path}")
        return 2

    text = read_text(path)
    findings = classify(text)
    unsafe = is_unsafe(text)

    payload: dict[str, Any] = {
        "path": str(path),
        "unsafe_detected": unsafe,
        "finding_count": len(findings),
        "findings": [f.as_dict() for f in findings],
        "categories": sorted({f.category for f in findings}),
        "owner_routes": sorted({OWNER_BY_CATEGORY[f.category] for f in findings}) or ["sf-verify"],
    }

    if args.fixtures:
        print(json.dumps(payload, indent=2, sort_keys=True))
    else:
        if payload["unsafe_detected"]:
            print("WARNING: unsafe scope detected; review required before public publication.")
        if payload["findings"]:
            print("Findings:")
            for finding in findings:
                print(f"- {finding.category}: {finding.match}")
            print("Recommended owners:", ", ".join(payload["owner_routes"]))
        else:
            print("No findings detected.")

    return 0 if (findings or unsafe) else 1


if __name__ == "__main__":
    raise SystemExit(main())
