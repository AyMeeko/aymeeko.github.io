## Installation

With Nix,
```
$ direnv allow
$ bundle install
$ bundle exec jekyll serve
```

If you're not using nix,

```
$ brew install rbenv
# ensure `eval "$(rbenv init -)"` is in ~/.zshrc
# open new shell
$ rbenv install 3.3.4
$ rbenv rehash
$ gem install bundler:2.5.16
$ bundle install
$ jekyll serve
```
