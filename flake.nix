{
  description = "Development shell for the energy drink shelf";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { nixpkgs, ... }:
    let
      systems = [ "aarch64-darwin" "x86_64-darwin" "aarch64-linux" "x86_64-linux" ];
    in {
      devShells = nixpkgs.lib.genAttrs systems (system: {
        default = nixpkgs.legacyPackages.${system}.mkShellNoCC {
          packages = [ nixpkgs.legacyPackages.${system}.bun ];
        };
      });
    };
}
