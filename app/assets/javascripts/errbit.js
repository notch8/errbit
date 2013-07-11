// App JS

Errbit = {
  currentTab: "summary",
  init:function () {

    Errbit.activateTabbedPanels();

    Errbit.activateSelectableRows();

    Errbit.toggleProblemsCheckboxes();

    Errbit.toggleRequiredPasswordMarks();

    Errbit.bindRequiredPasswordMarks();

    // On page apps/:app_id/edit
    $('a.copy_config').on("click", function() {
      $('select.choose_other_app').show().focus();
    });

    $('select.choose_other_app').on("change", function() {
      var loc = window.location;
      window.location.href = loc.protocol + "//" + loc.host + loc.pathname +
                             "?copy_attributes_from=" + $(this).val();
    });

    $('input[type=submit][data-action]').click(function() {
      $(this).closest('form').attr('action', $(this).attr('data-action'));
    });

    $('.notice-pagination').each(function() {
      $.pjax.defaults = {timeout: 2000};

      $('#content').pjax('.notice-pagination a').on('pjax:start', function() {
        $('.notice-pagination-loader').css("visibility", "visible");
        Errbit.currentTab = $('.tab-bar ul li a.button.active').attr('rel');
      }).on('pjax:end', function() {
        Errbit.activateTabbedPanels();
      });
    });

    // Show external backtrace lines when clicking separator
    $('td.backtrace_separator span').on('click', Errbit.show_external_backtrace);
    // Hide external backtrace on page load
    Errbit.hide_external_backtrace();

    $('.head a.show_tail').click(function(e) {
      $(this).hide().closest('.head_and_tail').find('.tail').show();
      e.preventDefault();
    });

  },

  activateTabbedPanels: function () {
    $('.tab-bar a').each(function(){
      var tab = $(this);
      var panel = $('#'+tab.attr('rel'));
      panel.addClass('panel');
      panel.find('h3').hide();
    });

    $('.tab-bar a').click(function(){
      Errbit.activateTab($(this));
      return(false);
    });
    Errbit.activateTab($('.tab-bar ul li a.button[rel=' + Errbit.currentTab + ']'));
  },

  activateTab: function (tab) {
    tab = $(tab);
    var panel = $('#'+tab.attr('rel'));

    tab.closest('.tab-bar').find('a.active').removeClass('active');
    tab.addClass('active');

    // If clicking into 'backtrace' tab, hide external backtrace
    if (tab.attr('rel') == "backtrace") { Errbit.hide_external_backtrace(); }

    $('.panel').hide();
    panel.show();
  },

  toggleProblemsCheckboxes: function () {
    var checkboxToggler = $('#toggle_problems_checkboxes');

    checkboxToggler.on("click", function() {
      $('input[name^="problems"]').each(function() {
        this.checked = checkboxToggler.get(0).checked;
      });
    });
  },

  activateSelectableRows: function () {
    $('.selectable tr').click(function(event) {
      if(!_.include(['A', 'INPUT', 'BUTTON', 'TEXTAREA'], event.target.nodeName)) {
        var checkbox = $(this).find('input[name="problems[]"]');
        checkbox.attr('checked', !checkbox.is(':checked'));
      }
    });
  },

  bindRequiredPasswordMarks: function () {
    $('#user_github_login').keyup(function(event) {
      Errbit.toggleRequiredPasswordMarks(this)
    });
  },

  toggleRequiredPasswordMarks: function (input) {
      if($(input).val() == "") {
        $('#user_password').parent().attr('class', 'required')
        $('#user_password_confirmation').parent().attr('class', 'required')
      } else {
        $('#user_password').parent().attr('class', '')
        $('#user_password_confirmation').parent().attr('class', '')
      }
  },

  hide_external_backtrace: function () {
    $('tr.toggle_external_backtrace').hide();
    $('td.backtrace_separator').show();
  },

  show_external_backtrace: function () {
    $('tr.toggle_external_backtrace').show();
    $('td.backtrace_separator').hide();
  }
}

$(function() {
  Errbit.init();
});
