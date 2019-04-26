
<?php 
 $arr1 = json_decode($_POST['massiv']);
 
 foreach ($arr1 as $val) {
     foreach($val as $k => $v) {
         echo $k." : ".$v."<br>";         
     }
 }

function RecolorImage($ImageSvgFile, $text)
    {
    $FileContents = file_get_contents($ImageSvgFile);
    
    $doc = new DOMDocument();
    $doc->loadXML($FileContents) or die();
    $AllTags = $doc->getElementsByTagName("text");
    foreach ($AllTags as $ATag)
        {
     $ATag->nodeValue = $text;
     $FileContents = $doc->saveXML($doc);

        }
        $file = fopen($ImageSvgFile, 'w+');
        fwrite($file, $FileContents);
        fclose($file);
    return $FileContents;
    }
echo RecolorImage('images/arrow.svg', $_POST['massiv']);
?>