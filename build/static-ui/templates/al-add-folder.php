<?php
$id = (isset($_GET['id'])) ? $_GET['id'] : '';

?>

<form id="al_remove_folder">
  <input type="hidden" name="id" value="<?php echo($id); ?>">
  <span class="al_sprite al_folder"></span> <input type="text" name="name" placeholder="Name of new folder">
  <div class="al_destination">
    Select a destination folder
    <ul><li><input type="radio" name="destination" checked>Workspace <span class="al_small">(default destination)</span></li>
      <li><ul><li><input type="radio" name="destination">Interpretation</li>
          <li><input type="radio" name="destination">Strategy</li>
          <li><input type="radio" name="destination">Accuracy</li>
          <li><input type="radio" name="destination">Completeness</li>
          <li><input type="radio" name="destination">Clarity</li>
          <li><input type="radio" name="destination">Reflection</li>
        </ul>
      </li>
    </ul>
  </div>
  <div class="al_controller">
    <a href="#" class="al_popup_close">CANCEL</a>
    <a href="#" class="al_popup_submit">SAVE</a>
  </div>
</form>
