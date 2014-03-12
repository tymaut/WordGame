<?php
include_once("simple_html_dom.php");

$task = $_GET["task"];
$arg1 = $_GET["arg1"];

switch($task){
	case "getText":
		$fileName= "words/".$arg1;
		$text = file_get_contents($fileName);
		$array = explode(" ",$text);
		echo (json_encode($array));
		break;
	case "processText":
		$fileName= "words/".$arg1;
		$contents = file_get_contents($fileName);
		$contents = trim($contents);
		$array = explode(" ",$contents);
		foreach ($array as $word) {
			$length = strlen($word);
			$fileToPut = "words/words".$length.".txt";
			$handle = fopen($fileToPut, 'a') or die('Cannot open file:  '.$fileToPut);
			$data = $word." ";
			fwrite($handle, $data);
			fclose($handle);
		}
		echo "finished!!";
		break;
}


function getFromUrl($url)
{
	$url = "http://en.wikipedia.org/wiki/Emanuel_Margoliash";
	$ch = curl_init();
	curl_setopt ($ch, CURLOPT_URL, $url);
	curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 5);
	curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
	$contents = curl_exec($ch);
	if (curl_errno($ch)) {
		echo curl_error($ch);
		echo "\n<br />";
		$contents = '';
	} 
	else {
		curl_close($ch);
		$html = str_get_html($contents);
		$element = $html->find('div[id=mw-content-text]');
		echo $element[0];
	}
	if (!is_string($contents) || !strlen($contents)) {
		echo "Failed to get contents.";
		$contents = '';
	}
}
?>