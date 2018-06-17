<?php
//#section#[header]
// Use Important Headers
use \API\Platform\importer;
use \API\Platform\engine;
use \Exception;

// Check Platform Existance
if (!defined('_RB_PLATFORM_')) throw new Exception("Platform is not defined!");

// Import DOM, HTML
importer::import("UI", "Html", "DOM");
importer::import("UI", "Html", "HTML");

use \UI\Html\DOM;
use \UI\Html\HTML;

// Import application for initialization
importer::import("AEL", "Platform", "application");
use \AEL\Platform\application;

// Increase application's view loading depth
application::incLoadingDepth();

// Set Application ID
$appID = 65;

// Init Application and Application literal
application::init(65);
// Secure Importer
importer::secure(TRUE);

// Import SDK Packages
importer::import("AEL", "Resources");
importer::import("UI", "Apps");

// Import APP Packages
//#section_end#
//#section#[view]
use \AEL\Resources\resource;
use \UI\Apps\APPContent;

// Create Application Content
$appContent = new APPContent($appID);
$actionFactory = $appContent->getActionFactory();

// Build the application view content
$appContent->build("", "maploader");

// Load map
$mapName = engine::getVar('map_name');
$mapContent = resource::get("/maps/".$mapName);

// Add action for map content
$appContent->addReportAction("maptemplate.load", $mapContent);

// Return output
return $appContent->getReport(".element_doesnot_exist");
//#section_end#
?>