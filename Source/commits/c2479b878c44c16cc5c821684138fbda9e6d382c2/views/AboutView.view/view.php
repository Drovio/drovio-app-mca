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
importer::import("AEL", "Literals");
importer::import("UI", "Apps");
importer::import("UI", "Presentation");

// Import APP Packages
//#section_end#
//#section#[view]
use \AEL\Literals\appLiteral;
use \UI\Apps\APPContent;
use \UI\Presentation\frames\windowFrame;

// Create Application Content
$appContent = new APPContent($appID);
$actionFactory = $appContent->getActionFactory();

// Build the application view content
$appContent->build("", "AboutViewContainer", TRUE);





// Create frame
$frame = new windowFrame();

// Build frame container
$title = appLiteral::get("about", "title");
$frame->build($title);

$frame->append($appContent->get());
return $frame->getFrame();
//#section_end#
?>