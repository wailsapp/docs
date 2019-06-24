# Development

In this section we cover all aspects of Wails development and contribution guidelines.

## Background

Historically, Wails development has been quite ad-hoc. The aim of this proposal is to create a simple workflow for contributing to the project. It is meant as a starting point and any improvements to this process are welcome (please open a ticket!).

## Issue Driven Development

If there is something to add to the code, whether a bug or enhancement, a ticket should be opened so that it can be discussed. If the coding goes ahead, a new branch should be created from the `develop` branch with a reference to the ticket ID, eg:
  `64 - Support react`

Commit messages should follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.3/#summary) format:

  * tag[(scope)]: message

| Tag             | Meaning              |
| --------------- | -------------------- |
| fix             | Bugfix               |
| feat            | New Feature          |
| docs            | Documentation update |
| BREAKING CHANGE | API Change           |

Examples:

  * fix: this is a fix for the project as a whole
  * fix(cli): this is a fix for the cli
  * docs: updated the contributors

## Branch Workflow

  * Wails uses a gitflow-like approach to development
  * Feature/Bugfix branches are created from the `develop` branch
  * Once the work is complete, pull requests should be made against the develop branch
  * As features are added, the `develop` branch is tagged with pre-release tags
  * Releases are made weekly, so at the end of the weekly cycle, the latest features and bugfixes that      were made will be merged to master and tagged with the next appropriate version.

Example:

  * After release v0.14.0, a ticket (#63) is opened requesting react support
  * This is worked on and a PR is made back to `develop`
  * Once merged, `develop` is tagged with `v0.14.1-pre`
  * A ticket (#64) is opened requesting ultralight support
  * This is worked on and a PR is made back to `develop`
  * Once merged, `develop` is tagged with `v0.14.2-pre`
  * We reach the end of our week and merge v0.14.2-pre to master, tagging it as v0.15.0
  * Work continues on the `devel` branch

<div class="imagecontainer" style="width:80%; margin: auto; margin-top: 30px">
  <img src="/media/develbranch.png">
</div>
