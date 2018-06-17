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
importer::import("UI", "Navigation", "navigationBar");
importer::import("UI", "Presentation", "dataGridList");

use \ESS\Prototype\UIObjectPrototype;
use \UI\Html\DOM;
use \UI\Navigation\navigationBar;
use \UI\Presentation\dataGridList;

/**
 * Map Log Viewer
 * 
 * Handles the logging interface for the entire application.
 * 
 * @version	0.1-3
 * @created	April 17, 2015, 12:00 (EEST)
 * @updated	April 30, 2015, 11:53 (EEST)
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
		
		// Add header toolbar
		$bar = new navigationBar();
		$navbar = $bar->build(navigationBar::TOP, $holder)->get();
		DOM::append($holder, $navbar);
		
		// Add clear button
		$clearTool = DOM::create("span", "", "", "objTool clear");
		$bar->insertToolbarItem($clearTool);
		
		
		// Add log list container
		$lglistContainer = DOM::create("div", "", "", "lglistContainer");
		DOM::append($holder, $lglistContainer);
		
		// Create grid list
		$gridList = new dataGridList();
		$logList = $gridList->build($id = "logList")->get();
		DOM::append($lglistContainer, $logList);
		
		// Set column ratios
		$ratios = array();
		$ratios[] = 0.3;
		$ratios[] = 0.7;
		$gridList->setColumnRatios($ratios);
		
		// Set headers
		$headers = array();
		$headers[] = "Time";
		$headers[] = "Log";
		$gridList->setHeaders($headers);
		
		return $this;
	}
}
//#section_end#
?>