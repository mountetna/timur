@show_edit = ->
  $('#values .value').each (value) -> $(this).hide()
  $('#values .edit_value').each (value) -> $(this).show()
  $('#edit').hide()
  $('#approve').css 'display', 'inline-block'
  $('#cancel').css 'display', 'inline-block'

@cancel_edit = ->
  $('#values .value').each (value) -> $(this).show()
  $('#values .edit_value').each (value) -> $(this).hide()
  $('#edit').show()
  $('#approve').hide()
  $('#cancel').hide()

@submit_edit = ->
  $('#values').submit()
