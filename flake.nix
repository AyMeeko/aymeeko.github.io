{
  description = "Ruby 3.3.4 development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
			let
				pkgs = import nixpkgs { inherit system; };
				ruby = pkgs.ruby_3_3;
			in
			{
				devShell = pkgs.mkShell {
					buildInputs = [
						ruby
						pkgs.bundler
					];

					shellHook = ''
						echo "Ruby ${ruby.version} development environment"
					'';
				};
			}
    );
}
