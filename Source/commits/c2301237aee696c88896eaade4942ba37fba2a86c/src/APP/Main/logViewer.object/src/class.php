<?php
//#section#[header]
// Namespace
namespace APP\Main;

require_once($_SERVER['DOCUMENT_ROOT'].'/_domainConfig.php');

// Use Important Headers
use \API\Platform\importer;
use \Exception;

// Check Platform Existance
if (!defined('_RB_PLATFORM_')) throw new Exception("Platform is not defined!");

// Import application loader
importer::import("AEL", "Platform", "application");
use \AEL\Platform\application;
//#section_end#
//#section#[class]
/**
 * @library	APP
 * @package	Main
 * @namespace	\
 * 
 * @copyright	Copyright (C) 2015 Manhattan-Cohesive Areas Visualization. All rights reserved.
 */

importer::import("ESS", "Prototype", "UIObjectPrototype");
importer::import("UI", "Html", "DOM");

use \ESS\Prototype\UIObjectPrototype;
use \UI\Html\DOM;

/**
 * Map Log Viewer
 * 
 * Handles the logging interface for the entire application.
 * 
 * @version	0.1-1
 * @created	April 17, 2015, 12:00 (EEST)
 * @updated	April 17, 2015, 12:00 (EEST)
 */
class logViewer extends UIObjectPrototype
{
	/**
	 * Build the log viewer object.
	 * 
	 * @param	string	$id
	 * 		The object id.
	 * 
	 * @param	string	$class
	 * 		The object class.
	 * 
	 * @return	logViewer
	 * 		The logViewer object.
	 */
	public function build($id = "", $class = "")
	{
		// Create log viewer holder
		$holder = DOM::create("div", "", "", "mapLogViewer");
		$this->set($holder);
		
		// Add header
		$header = DOM::create("div", "", "", "header");
		DOM::append($holder, $header);
		
		// Add log list
		$lglist = DOM::create("ul", "", "", "lglist");
		DOM::append($holder, $lglist);
		
		return $this;
	}
}
//#section_end#
?>