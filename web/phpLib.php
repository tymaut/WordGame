<?php

//include_once("simple_html_dom.php");



$task = $_GET["task"];
$arg1 = $_GET["arg1"];
$arg2 = $_GET["arg2"];


switch($task){

	case "getText":

		$text = file_get_contents("words/words".$arg1.".txt");

		$array = explode(" ",$text);

		echo (json_encode($array));

		break;
	
	case "getTextWithParam":
		$limit = $arg1;
		$seed = $arg2;
		$finalArray = array();
		for ($i=4; $i <= $limit; $i++) { 
			$text = file_get_contents("words/words".$i.".txt");
			$array = explode(" ", $text);
			srand($arg2+$i-4);
			$begin = rand(1,10);
			do
			{
				$hop = rand(1,10);
			}
			while($begin%$hop == 0 || $hop%$begin == 0);
			$j = $begin;
			while($j<count($array) && count($finalArray)<100)
			{
				if(strlen($array[$j])>0)
				{
					array_push($finalArray, $array[$j]);
					
				}
				$j+=$hop;
			}
		}
		srand($arg2);
		SEOshuffle($finalArray,rand());
		echo(json_encode($finalArray));
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


function SEOshuffle(&$items, $seed=false) {
	$original = md5(serialize($items));
	mt_srand(crc32(($seed) ? $seed : $items[0]));
	for ($i = count($items) - 1; $i > 0; $i--){
		$j = @mt_rand(0, $i);
		list($items[$i], $items[$j]) = array($items[$j], $items[$i]);
	}
	if ($original == md5(serialize($items))) {
		list($items[count($items) - 1], $items[0]) = array($items[0], $items[count($items) - 1]);
	}
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