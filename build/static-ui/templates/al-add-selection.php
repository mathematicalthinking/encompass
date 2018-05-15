<?php
$id = (isset($_GET['id'])) ? $_GET['id'] : '';

?>

<form id="al_add_selection">
  <input type="hidden" name="id" value="<?php echo($id); ?>">
  Select a folder for this selection:
  <div class="al_destination">
    <ul><li><input type="checkbox" name="destination"><span class="al_indicator">&#9656;</span>Interpretation</li>
      <li class="al_children">
        <input type="checkbox" name="destination"><span class="al_indicator">&#9662;</span>Strategy
        <ul><li><input type="checkbox" name="destination"><span class="al_indicator"></span>Interpretation</li>
          <li><input type="checkbox" name="destination"><span class="al_indicator"></span>Strategy</li>
          <li><input type="checkbox" name="destination"><span class="al_indicator"></span>Accuracy</li>
          <li><input type="checkbox" name="destination"><span class="al_indicator"></span>Completeness</li>
          <li><input type="checkbox" name="destination"><span class="al_indicator"></span>Clarity</li>
          <li><input type="checkbox" name="destination"><span class="al_indicator"></span>Reflection</li>
        </ul>
      </li>
      <li><input type="checkbox" name="destination"><span class="al_indicator"></span>Accuracy</li>
      <li><input type="checkbox" name="destination"><span class="al_indicator"></span>Completeness</li>
      <li><input type="checkbox" name="destination"><span class="al_indicator"></span>Clarity</li>
      <li><input type="checkbox" name="destination"><span class="al_indicator"></span>Reflection</li>
    </ul>
    <span class="al_sprite al_add_folder"></span>
  </div>
  Comments about this section <span class="al_small">(optional)</span>
  <ul><li><input type="radio" name="destination"> <span class="al_sprite al_notice"></span>Interpretation</li>
    <li><input type="radio" name="destination"> <span class="al_sprite al_wonder"></span>Strategy</li>
    <li><input type="radio" name="destination"> <span class="al_sprite al_feedback"></span>Accuracy</li>
  </ul>
  <textarea placeholder="I wonder..." name="comments"></textarea>
  <div class="al_controller">
    <a href="#" class="al_popup_close">CANCEL</a>&nbsp;&nbsp;|&nbsp;&nbsp;
    <a href="#" class="al_popup_submit">SAVE</a>
  </div>
</form>
<script type="text/javascript">
  $('.al_destination>ul')
    .mCustomScrollbar({
      set_height: 180,
      advanced: {
        updateOnBrowserResize:true,
        updateOnContentResize: true
      }
    });
  //
</script>
