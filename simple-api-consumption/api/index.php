<?php
header('Content-type: application/json');
header('Cache-Control: no-cache');

// We need PHP 5 >= 5.3.0 to be able to use "Lower Case First" function
// In my server I am running 5.2.12 for an application I need to migrate but today is today :)
if(function_exists('lcfirst') === false) {
    function lcfirst($str) {
        $str[0] = strtolower($str[0]);
        return $str;
    }
}

// Applying camelcase to the properties
function camelCase($word) {
	return lcfirst(str_replace(' ', '', ucwords(strtr($word, '_-', ' '))));
}

// Converting the content from a .csv file to an array, 
function getArrayFromFile($file) { 
	$delimiter = ',';
	if (($handle = fopen($file, 'r')) !== FALSE) { 
		$i = 0; 
		while (($lineArray = fgetcsv($handle, 4000, $delimiter, '"')) !== FALSE) { 
			for ($j = 0; $j < count($lineArray); $j++) { 
				$arr[$i][$j] = $lineArray[$j]; 
			} 
			$i++; 
		} 
		fclose($handle); 
	} 
	return $arr; 
} 

// I am against defensive programming regarding API/RESTful so: the first line will be used for properties names.
// If the first line of the .csv file is not describing the properties is because the file is not following our requirements
// So, we read the file and get its content as an array, then we substract -1 to $count to define the total of records 

// But Angel why are you against --defensive programming--? I mean, that's sound awful
// Because there is an application architecture and we must have guidelines. Also, an error should be attacked in its origin.
// In this case: we should not validate if the first line is for titles or not because MUST be. 
// Attacking issues in the root saves money and time and makes applications better.
$feed = 'data.csv';
$data = getArrayFromFile($feed);
$count = count($data) - 1;
 
// Getting the property names, which of course exist and are in the first line of our file. No doubts about it
// We apply the camelCase format to the properties (because life needs standardization)
$propertyKeys = array();
$propertyName = array_shift($data);
foreach ($propertyName as $name) {
	$propertyKeys[] = camelCase($name);
}

// The following functionality is just for fun, lets imagine our API endpoint also give us the location of the rooms
// and the valid inputs the user can type in the textarea or form input. This was added only to make our endpoint prettier
$propertyKeys[] = 'location';
$roomsAroundUSA = Array(
	(object) array(
          'coutry' => 'USA (United States of America)',
          'city' => 'New York',
		  'state' => 'NY'
    ),
	(object) array(
          'coutry' => 'USA (United States of America)',
          'city' => 'Seattle',
		  'state' => 'WA'
    ),
	(object) array(
          'coutry' => 'USA (United States of America)',
          'city' => 'Los Angeles',
		  'state' => 'CA'
    ),
	(object) array(
          'coutry' => 'USA (United States of America)',
          'city' => 'Miami',
		  'state' => 'FL'
    ) 
);

for ($i = 0; $i < $count; $i++) {
  $data[$i][] = $roomsAroundUSA[array_rand($roomsAroundUSA)];
}

$results = array();
for ($i = 0; $i < $count; $i++) {
	$d = array_combine($propertyKeys, $data[$i]);
	$results[$i] = $d;
}

$startDates = array();
$endDates = array();
foreach ($results as $result) {
	$startDates[] = trim(substr($result['startDay'], 0, -3));
	if (!empty($result['endDay']) ){
		$endDates[] = trim(substr($result['endDay'], 0, -3));
	}
}

$uniqueDates = array();
$uniqueDates = array_unique(array_merge($startDates, $endDates));
sort($uniqueDates);

$oldest = $uniqueDates[array_search(min($uniqueDates), $uniqueDates)];
$newest = $uniqueDates[array_search(max($uniqueDates), $uniqueDates)];

$output = array();
$time   = strtotime($oldest . '-01');
$last   = date('Y-m', strtotime($newest . '-01'));

do {
    $month = date('Y-m', $time);
    $total = date('t', $time);
    $output[] = (object) array(
        'month' => $month,
        'days' => $total
    );

    $time = strtotime('+1 month', $time);
} while ($month != $last);


$validInputs = array();
$validInputs = array_unique($validInputs);

$metadata = (object) array('roomsInList' => $count, 'uniqueListedMonths' => array_values($uniqueDates), 'allowedInputs' => $output);
$response = (object) array(
				'metadata' => $metadata, 
				'results' => $results
			);
			
echo json_encode($response);
?>