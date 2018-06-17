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
importer::import("UI", "Apps");
importer::import("UI", "Forms");
importer::import("UI", "Presentation");

// Import APP Packages
application::import("Main");
//#section_end#
//#section#[view]
use \UI\Apps\APPContent;
use \UI\Forms\Form;
use \UI\Presentation\gridSplitter;
use \UI\Presentation\tabControl;
use \APP\Main\logViewer;

// Create Application Content
$appContent = new APPContent($appID);
$actionFactory = $appContent->getActionFactory();

// Build the application view content
$appContent->build("", "MCA_Visual", TRUE);

// Add menu actions
$aboutItem = HTML::select(".navbar .navitem.about")->item(0);
$actionFactory->setAction($aboutItem, "AboutView");

$howtoItem = HTML::select(".navbar .navitem.howto")->item(0);
$actionFactory->setAction($howtoItem, "HowToView");

$mca = HTML::select(".MCA_Visual .mcaMainContainer")->item(0);
$gsp = new gridSplitter();
$splitter = $gsp->build(gridSplitter::ORIENT_VER, gridSplitter::SIDE_BOTTOM, TRUE, "Log Viewer")->get();
DOM::append($mca, $splitter);

// Create the startView and the processView
$startView = DOM::create("div", "", "", "startView panel selected");
$gsp->appendToMain($startView);

$dropArea = DOM::create("div", "Drop a map file here!", "", "drop-area");
DOM::append($startView, $dropArea);
/*
// Add templates
$templateTitle = DOM::create("h2", "Or choose from a template:", "", "hd");
DOM::append($startView, $templateTitle);

$templateContainer = DOM::create("div", "", "", "templateContainer");
DOM::append($startView, $templateContainer);
$templates = array();
$templates["maps/map_simple_512.map"] = "S-Labirynth 512";
$templates["maps/map_complex_512.map"] = "C-Labyrinth 512";
$templates["maps/baldurs.map"] = "Baldurs Gate";
$templates["maps/random.map"] = "Random";
foreach ($templates as $mapTemplate => $mapTitle)
{
	// Create tile
	$templateTile = DOM::create("div", "", "", "ttile template");
	DOM::append($templateContainer, $templateTile);
	DOM::data($templateTile, "map", $mapTemplate);
	
	// Add ico
	$tIco = DOM::create("div", "", "", "ico");
	DOM::append($templateTile, $tIco);
	
	// Add title
	$tTitle = DOM::create("div", $mapTitle, "", "title");
	DOM::append($templateTile, $tTitle);
}
*/
$processView = DOM::create("div", "", "", "processView panel");
$gsp->appendToMain($processView);


// Create tab control for logs
$tb = new tabControl(FALSE);
$logTabber = $tb->build()->get();
$gsp->appendToSide($logTabber);

// Add logViewer
$lv = new logViewer();
$logViewer = $lv->build()->get();
$tb->insertTab($id = "logger", $header = "Map Logs", $logViewer, $selected = TRUE);




// Horizontal splitter for map container and actions
$gsp = new gridSplitter();
$splitter = $gsp->build(gridSplitter::ORIENT_HOZ, gridSplitter::SIDE_RIGHT, FALSE, "Map Actions")->get();
DOM::append($processView, $splitter);

// Map container
$mapContainer = DOM::create("div", "", "", "mapContainer");
$gsp->appendToMain($mapContainer);

// Actions container
$actionContainer = DOM::create("div", "", "", "actionContainer");
$gsp->appendToSide($actionContainer);

// Add actions
$action = DOM::create("div", "Change Map", "", "action restart");
DOM::append($actionContainer, $action);

$searchControls = DOM::create("div", "", "", "searchControls");
DOM::append($actionContainer, $searchControls);

// Start and end point
$form = new Form();
$startPoint = $form->getInput($type = "text", $name = "start_point", $value = "", $class = "point_input", $autofocus = FALSE, $required = FALSE);
DOM::append($searchControls, $startPoint);
DOM::attr($startPoint, "placeholder", "Start (x,y)");

$endPoint = $form->getInput($type = "text", $name = "end_point", $value = "", $class = "point_input", $autofocus = FALSE, $required = FALSE);
DOM::append($searchControls, $endPoint);
DOM::attr($endPoint, "placeholder", "Goal (x,y)");

$action = DOM::create("div", "Search For Path", "", "action search");
DOM::append($searchControls, $action);


// Return output
return $appContent->getReport();
//#section_end#
?>