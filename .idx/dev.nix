{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
  ];
  idx.extensions = [
    
  
 "ahmadawais.shades-of-purple"
 "Google.validation-agent-extension"
 "Letgamer.sweet-vscode-icons"];
  idx.previews = {
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
}