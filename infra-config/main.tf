terraform {
  required_version = ">= 0.13"
  required_providers {
    azurerm = {
      source  = "digitalocean/digitalocean"
      version = ">= 2.10.0"
    }
  }
}
provider "digitalocean" {
  token = "YOUR_DIGITALOCEAN_API_TOKEN"
}

resource "digitalocean_droplet" "web_server" {
  name      = "web-server-droplet"
  image     = "ubuntu-20-04-x64"
  size      = "s-1vcpu-1gb"
  region    = "nyc1"
  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update
              sudo apt-get install -y docker.io
              sudo docker run -d -p 80:80 --name web-server nginx
              EOF
}

resource "digitalocean_database_cluster" "postgres_db" {
  name   = "postgres-db-cluster"
  engine = "pg"
  version = "13"

  node_count       = 1
  size             = "db-s-1vcpu-1gb"
  region           = "nyc1"

  db_name   = "your_database_name"
  db_user   = "your_database_user"
  db_pass   = "your_database_password"
}

output "web_server_ip" {
  value = digitalocean_droplet.web_server.ipv4_address
}

output "postgres_db_connection" {
  value = digitalocean_database_cluster.postgres_db.connection
}
