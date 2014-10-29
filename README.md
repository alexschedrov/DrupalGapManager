DrupalGapManager
----------------

DrupalGapManager is a command-line tool and scripting interface for DrupalGap.

This tool allows you to interact and manage your [DrupalGap](http://www.drupalgap.org) application.

## Installation
	$ npm install -g dgm

or

	$ sudo npm install -g dgm

Requires [node.js](http://nodejs.org)

## Available commands  
* [create](#create-application)
* [create-theme](#create-theme)
* [dl](#donwload-module)  
* [en](#enable-module)
* [dis](#disable-module)
* [pml](#show-a-list-of-available-modules)

## Example usage

##### Create application
	$ dgm create <PLATFORM> <NAME> [--url=<URL>]

Only SDK:

	$ dgm create web web-application --url=http://www.drupalgap.org

Cordova project with SDK inside:
	
	$ dgm create ios newApp --url=http://www.drupalgap.org
	$ dgm create android newApp --url=http://www.drupalgap.org
	
##### Create theme
	$ dgm create-theme <NAME>
	
Example:

	$ dgm create-theme awesome_theme	
	
##### Donwload module
	$ dgm dl <MODULE>

Example:
	
	$ dgm dl telephone
	$ dgm dl commerce
	
##### Enable module
	$ dgm en <PROJECT> [--custom]

Example:
	
	$ dgm en commerce
	$ dgm en custom_module --custom

##### Disable module
	$ dgm dis <PROJECT> [--custom]

Example:
	
	$ dgm dis commerce
	$ dgm dis custom_module --custom
	
##### Show a list of available modules
	$ dgm pml
	

[![Build Status](https://travis-ci.org/Sanchiz/DrupalGapManager.svg?branch=master)](https://travis-ci.org/Sanchiz/DrupalGapManager)