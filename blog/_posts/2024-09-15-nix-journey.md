---
layout: post
title: "Nix: An Extremely Cool and Confusing Journey"
date: 2024-09-15
categories: blog
---
I've been hearing a lot about [Nix](https://nixos.org/) lately on tech Twitter.

<figure>
  <img src="{{ site.url }}/assets/images/nix-solves-this.jpeg" alt="Image depicting fighting intrusive thoughts which say, 'Nix solves this'"/>
</figure>

From what I heard, it seemed like Nix could solve a problem I was having — maintaining the development environment of several machines. For a long time, I've maintained a [dotfiles](https://github.com/AyMeeko/dotfiles/) repo where I would dump anything I needed to set up a new machine, along with a minimal symlink script to put things like neovim and tmux configs in place. This was *fine* for the most part because I don't actually require a ton of config in a new dev machine, but over time, it's been nagging at me that I wish I had something better. This approach had a few loose ends that were really irritating. For example, it was macOS specific, which meant I had to refactor it in some way to play around in Linux. It also didn't leave any room for deviation between the machines. The configs became bloated with everything *any* machine needed.

I'm aware of some popular ways to manage dotfiles — using [Stow](https://www.gnu.org/software/stow/) or [Ansible](https://www.ansible.com/), and I considered digging into these and trying them out, but it seemed like overwhelmingly, people are switching *off* of these in favor of Nix!

<figure>
  <img src="{{ site.url }}/assets/images/i-guess.png" alt="'I GUESS' from Gunshow comic by KC Green"/>
  <figcaption><a href="https://gunshowcomic.com/367">From "Gunshow" by KC Green</a></figcaption>
</figure>

I was wary of borking a computer I was actively developing on so, I bought a Thinkpad t440p on ebay for $100 and installed PopOS on it. With a fresh computer to play with, I set out to understand Nix and [Home-Manager](https://github.com/nix-community/home-manager).

Starting out, I learned the whole ecosystem is, well, *really* confusing. I found this extremely helpful blog post [Declarative macOS Configuration Using nix-darwin And home-manager](https://xyno.space/post/nix-darwin-introduction) that really highlights some of the confusion well:

> there are: nix (Programming language), nix (Package manager), nixpkgs (Package repo), NixOS (Linux Distribution)\
> \
> nix (Programming language) != nix (Package manager)\
> nixpkgs != NixOS, but NixOS is a subset of nixpkgs\
> nixpkgs != nix\
> nix flakes are elements of nix, but not elements of nixpkgs

On top of that, I sought to understand home-manager and [nix-darwin](https://github.com/LnL7/nix-darwin). I want to say that digging into all of them together was a mistake, as understanding what each package was *doing* and how they overlapped caused a lot of confusion, but I don't know how I'd have fully conceptualized Nix (the package manager) itself without Home-Manager or nix-darwin.

This blog post is not going to teach you Nix. Instead, it's going to document the things I personally found extremely confusing. It's the doc I wish I'd found.

#### Diversity of Configurations

I tend to learn by example, and there no shortage of repos to reference on GitHub. However, after many hours digging into other peoples' configs, I learned there is not just one de facto way to do things here, which means every implementation is a special snowflake config. Taking a step back, that makes a lot of sense! Everyone's use-case is hyper specific to their situation! Unfortunately for me, most repos didn't outline in plain English what that situation was, though. I had to derive how these repos were used based on the nix configurations I found there.

Ultimately, I found configs that supported a variety of situations:

- managing a single machine
- setting up a certain environment and being able to replicate it across a defined set of architectures
    - e.g. "install this list of packages" and it would work on all configured hardware
- setting up multiple machines that have some shared components and some unique components

I highlight this because it was something that I didn't quite consider until I was deep in it. I was too focused on what _I_ wanted to do with Nix that I didn't consider other possibilities. Turns out, Nix and Home-Manager are used for managing systems in _lots_ of different ways and you'll be more productive in your learning journey with this frame of mind.
#### Nix vs Home-Manager vs nix-darwin

With so many ways to do things, it was really unclear to me where the lines between these three tools were, which meant it was really difficult to know where a piece of config should go. Some examples also seemed to have a "system" configuration and a "home-manager" configuration, and enough variation in the examples I was referencing meant that I couldn't quite pattern match what the difference really was. Colloquially, these two terms seemed semantically equivalent to me.

At long last, here's what I've come to understand.
#### NixOS

NixOS is a Linux distribution which allows you to configure your entire machine declaratively using Nix. At a base level, this is accomplished via a single `configuration.nix` file. In this file, you can define everything about the system. I recommend perusing the [NixOS](https://nixos.org/manual/nixos/stable/) manual for a few minutes, even if you're not setting up a NixOS machine.

I said you can configure everything about the system but actually, you can configure... almost everything. You can [configure multiple users](https://nixos.org/manual/nixos/stable/#sec-user-management), but as far as I can tell, you can't manage those users' home directories. This is where Home-Manager comes in.

#### Home-Manager
Home-Manager is where you manage a user's home directory, which can include installed fonts, dotfiles, and user-specific applications. If you're managing a NixOS system, you'd have a `configuration.nix` which defines all the system-wide configuration, as well as defining different users of the system, but you'd want to pull in Home-Manager to provide those users more fine-grained personalization.

##### tl;dr:
- "system" configs define a system's overall setup, which can include global settings, services, and packages that will be available to all users of the system.
    - usually requires root or admin privileges
    - affects the entire operating system
- "home-manager" configs are intended to be user specific configurations.
    - used to manage user-specific dotfiles, applications, and settings

That's all fine and good, but what if I don't want to run NixOS? What if I'm on macOS?
#### nix-darwin
This is where [nix-darwin](https://github.com/LnL7/nix-darwin) comes in! This project aims to give you the system-level configuration available on NixOS, but on macOS. This includes configuring things like whether your dock hides automatically or whether you use "natural scroll." There is a slew of configuration options in the [documentation](https://daiderd.com/nix-darwin/manual/index.html#sec-options).

Notably, neither NixOS nor nix-darwin pull in Home-Manager directly. Instead, they both support Home-Manager as an add-in module.

#### Let's look at an example

Below is a `flake.nix` file which defines an Intel-based macOS system.
```nix
{
  description = "Kickstart Nix on macOS";

  inputs = {
    nixpkgs = {
      url = "github:NixOS/nixpkgs/nixos-24.05";
    },
    nix-darwin = {
      url = "github:LnL7/nix-darwin";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    home-manager = {
      url = "github:nix-community/home-manager/release-24.05";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs@{
    self,
    nixpkgs,
    nix-darwin,
    home-manager,
    ...
  }:
    {
      darwinConfigurations = {
        amy = let
          username = "amy";
          system = "x86_64-darwin";
        in
          nix-darwin.lib.darwinSystem {
            inherit system;
            specialArgs = {
              inherit inputs username;
            };
            modules = [
              ./module/darwin-configuration.nix
              home-manager.darwinModules.home-manager
              {
                home-manager.useGlobalPkgs = true;
                home-manager.useUserPackages = true;
                home-manager.extraSpecialArgs = {
                  inherit inputs;
                };
                home-manager.users."${username}" = {
                  pkgs,
                  ...
                }: {
                  imports = [
                    ./host/amy.nix
                    ./module/home-manager.nix
                  ];
                };
              }
            ];
          };
      };
    };
}
```

Three modules are passed into `nix-darwin.lib.darwinSystem`:
  - `./module/darwin-configuration.nix`
    - This module contains configuration for nix-darwin, or _system_ level configurations.
    - Reference the nix-darwin [documentation](https://daiderd.com/nix-darwin/manual/index.html#sec-options) for a better understanding of what configuration can be defined here.
  - `home-manager.darwinModules.home-manager`
    - The first instance of `home-manager` in this line is referencing the [home-manager package](https://github.com/nix-community/home-manager).
    - `darwinModules` is a module [defined](https://github.com/nix-community/home-manager/blob/a9c9cc6e50f7cbd2d58ccb1cd46a1e06e9e445ff/flake.nix#L16) by home-manager, which [defines](https://github.com/nix-community/home-manager/blob/a9c9cc6e50f7cbd2d58ccb1cd46a1e06e9e445ff/nix-darwin/default.nix) a version of itself to be used with nix-darwin
  - a literal block (`{}`) that contains home-manager config
    - Reference the home-manager [documentation](https://nix-community.github.io/home-manager/options.xhtml) for to understand what the available config options are.

#### Conclusions
I still feel like I have a lot to learn, but it's been a really fun (and frustrating) journey! As of this writing, you can peruse my current situation at [AyMeeko/kickstart.nix](https://github.com/AyMeeko/kickstart.nix). This repo loosely manages a PopOS machine, a PC running WSL, and an Intel based Mac Mini that has two users. It's definitely not a perfect setup, as nix-darwin isn't _really_ set up to handle multiple users on a single machine, but it works well enough for my uses for now.

If you found this write-up helpful, feel free to let me know on [Twitter](https://x.com/aymeeko).

#### Resources
Below are some things I referenced along the way. Some might've been linked to earlier in this post!

- [Evertras/simple-homemanager](https://github.com/Evertras/simple-homemanager)
- [thexyno/nixos-config](https://github.com/thexyno/nixos-config)
- [dmmulroy/kickstart.nix](https://github.com/dmmulroy/kickstart.nix)
- [moni-dz/nix-config](https://github.com/moni-dz/nix-config)
- [srid/nixos-config](https://github.com/srid/nixos-config)
- [ALT-F4-LLC/kickstart.nix](https://github.com/ALT-F4-LLC/kickstart.nix)
