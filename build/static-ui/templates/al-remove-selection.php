<?php
$id = (isset($_GET['id'])) ? $_GET['id'] : '';
?>

<form id="al_remove_folder">
	<input type="hidden" name="id" value="<?php echo($id); ?>">
	<span class="al_sprite al_selection"></span> &rarr; <span class="al_sprite al_folder al_remove"></span><br>
	Remove this selection?
	<div class="al_foldername">
		"<?php echo($id); ?>"
	</div>
	<div class="al_controller">
		<a href="#" class="al_popup_close">CANCEL</a>
		<a href="#" class="al_popup_submit">REMOVE</a>
	</div>
</form>