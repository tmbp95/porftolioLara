<?
    $dir_name = "path/to/image/folder/";
    $images = glob($dir_name."*.png");
    foreach($images as $image) {
        echo '<img src="'.$image.'" /><br />';
    }
?>