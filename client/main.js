$(document).ready(function () {
  $('#form').submit(function (event) {
    event.preventDefault();
    const prompt = $('#prompt').val();
    const temperature = $('#temperature').val();
    const max_tokens = $('#max_tokens').val();
    
    $.ajax({
      type: 'POST',
      url: '/api/completions',
      data: {
        prompt: prompt,
        temperature: temperature,
        max_tokens: max_tokens
      },
      success: function(response) {
        document.getElementById("response").innerHTML = response.result.replace(/\n/g, '<br />');
      }
      
    });
  });
});
