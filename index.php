<?php
sleep(2);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>前端开发UI组件</title>
    <style>iframe{display:block;}</style>
</head>
<body>
<iframe width="100%" name="srcchange" id="srcchange" src="index.html" frameborder="0"></iframe><a target="srcchange" href="testiframeloading.php">换个src</a>

<script>
var iframe = document.getElementById('srcchange').contentWindow;
window.onbeforeunload = function(){
	//alert('父窗口')
	iframe.onbeforeunload = null;
}
</script>
</body>
</html>
