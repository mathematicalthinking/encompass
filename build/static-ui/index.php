<?php
	
	$page = (isset($_GET['p'])) ? $_GET['p'] : '';

?>
<!DOCTYPE html>
<html><head>
	<title>Drexel | EnCOMPASS</title>
	<meta name="keywords" content="keywords">
	<meta name="description" content="description">
	<meta charset="utf-8"> 
	<!--[if IE]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
	<!--[if IE 7]><link rel="stylesheet" type="text/css" href="css/ie7.css" /><![endif]-->
	<!--[if IE 8]><link rel="stylesheet" type="text/css" href="css/ie8.css" /><![endif]-->
	<!--[if IE 9]><link rel="stylesheet" type="text/css" href="css/ie9.css" /><![endif]-->
	<link rel="stylesheet" type="text/css" href="css/style.css">
	<link rel="stylesheet" type="text/css" href="css/index.css">
	<link rel="stylesheet" type="text/css" href="css/jqtree.css">
	<link rel="stylesheet" href="css/jquery.mCustomScrollbar.css" type="text/css" media="screen" charset="utf-8">
</head>
<body>

	<?php include('templates/al-header.php'); ?>

	<section id="al_body">
		<?php
			//*	load template
			//
				$template = '';
				if ($page == '') {
					$template = 'al-workspace-select.php';
				} else {
					$template = 'al-su-seta.php';
				}
				include('templates/'. $template);
			//
		?>
	</section>

	<script src="js/jquery-1.9.1.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="js/jquery-migrate-1.2.1.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="js/tree.jquery.js" type="text/javascript" charset="utf-8"></script>
	<script src="js/jquery.mCustomScrollbar.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="js/jquery.mousewheel.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="js/ready.js" type="text/javascript" charset="utf-8"></script>

</body></html>
