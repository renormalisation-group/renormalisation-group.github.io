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
