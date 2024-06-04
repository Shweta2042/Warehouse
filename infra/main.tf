provider "azurerm" {
  features {}
}

data "azurerm_resource_group" "rg" {
    name = var.rg_name
}

resource "azurerm_service_plan" "warehouseInventory" {
  name                = var.plan_name
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "S1"
}

resource "azurerm_linux_web_app" "warehouseinventoryapp" {
  name                = var.app_name
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.warehouseInventory.id

  site_config {
    always_on = true

    application_stack {
      node_version = "20-lts"
      docker_registry_url = var.registry_url
      docker_registry_username = var.registry_username
      docker_registry_password = var.registry_password
    }
  }
}