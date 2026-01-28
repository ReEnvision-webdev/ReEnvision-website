{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.gh
  ];
  idx.extensions = [
    "ahmadawais.shades-of-purple"
    "Google.validation-agent-extension"
    "Letgamer.sweet-vscode-icons"
  ];
  idx.previews = {
    enable = true; # Required to activate the previews block
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "-p"
          "$PORT"
        ];
        manager = "web";
      };
    };
  };
  

  # Standard environment variables go here. 
  # If you don't specifically need 'currentNodeJsVersion' for your app code, remove it.
  env = {
  # Add this specific field if the Studio backend is looking for it
  currentNodeJsVersion = "20"; 
  NODE_VERSION = "20";
};

}
