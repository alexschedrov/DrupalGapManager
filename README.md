DrupalGapManager
----------------

DrupalGapManager is a command-line tool and scripting interface for DrupalGap.

This tool allows you to interact and manage your DrupalGap application.

## Installation
	$ npm install -g dgm

or

	$ sudo npm install -g dgm

Requires [node.js](http://nodejs.org)


## Example usage

##### Create Cordova application
	$ dgm create <PLATFORM> <NAME> [--url=<URL>]

Example:
	
	$ dgm create ios NewApp --url=http://www.drupalgap.org
	$ dgm create android NewApp --url=http://www.drupalgap.org
	
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