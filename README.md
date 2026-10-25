# The Renormalisation Group

A multi-author Jekyll site based on the customized Field Notes source at
https://github.com/madhusudhanraman/madhusudhanraman.github.io.

All inherited posts, personal pages, profile text and content images have been removed.
The theme, mathematical rendering, footnotes, archives and media layouts remain.
The new skin uses muted teal accents on ivory.

Start with [CONTRIBUTING.md](CONTRIBUTING.md) for GitHub setup and author instructions.
See [CUSTOMIZATIONS.md](CUSTOMIZATIONS.md) for the retained features.

## Local preview

Install Ruby 3.3 and Bundler, then run:

```sh
bundle install
ruby scripts/check_contributors.rb
bundle exec jekyll serve --baseurl ""
```

Open http://localhost:4000. Restart Jekyll after changing `_config.yml`.
The production address is https://renormalisation-group.github.io/.

The Actions workflow builds pull requests and deploys merges to `main` once Pages
is configured. The repository is maintained at
https://github.com/renormalisation-group/renormalisation-group.github.io.

## Collaboration workflow

Madhusudhan and Adwait should use one branch per flow or change. Keep `main` as
the agreed version of the website, and merge changes through pull requests.
Conflicts cannot be eliminated entirely, but small, coordinated changes make them
less likely and easier to resolve.

### For each change in GitHub Desktop

1. **Update `main`.** Select **Current Branch → main**, click **Fetch origin**,
   then **Pull origin** if offered. Fetch checks for updates; Pull downloads them.
2. **Create a task branch.** Select **Branch → New Branch**, starting from the
   updated `main`. Use a name such as `madhu/new-flow` or `adwait/about-edit`.
   Create a fresh branch for each task rather than a permanent branch per person.
3. **Edit and preview locally.** Check the affected pages in the local preview.
   Commit with a descriptive message, then click **Publish branch** or
   **Push origin**. Unfinished work can be committed and pushed to the task branch.
4. **Open a pull request into `main`.** Describe what changed and request review
   from the other person. GitHub automatically checks that the website builds.
5. **Review and merge.** Once the build passes and the changes are agreed,
   merge the pull request on GitHub and delete its branch.
6. **Sync before the next task.** Return to `main` in GitHub Desktop, fetch and
   pull the merged changes, then create the next task branch. Both laptops need
   to pull updates independently.

### Keeping conflicts uncommon

- Put each new flow in its own file. Different articles can usually be written
  at the same time without conflicts.
- Coordinate changes to shared files, especially typography, layouts, navigation,
  and configuration. Tell the other person before editing the same files.
- Keep pull requests focused and merge them promptly. If `main` changes while a
  task is in progress, update local `main`, return to the task branch, and use
  **Branch → Merge into Current Branch** to merge `main` into it. Preview again
  and push the updated branch.
- Avoid direct pushes to `main` and force pushes.
- If a conflict appears, compare both versions and preserve the intended changes.
  Do not blindly choose “mine” or “theirs”; agree on the combined result.

The workflow's **build** check validates pull requests. Publishing is separate:
the **deploy** job requires GitHub Pages to be enabled and a plan that supports
Pages for this private organisation repository.
