// var gui = require('nw.gui');
// // Create an empty menu
// var menu = new gui.Menu({'type': 'menubar'});

// // File menu
// var mnuFile = new gui.Menu();
// mnuFile.append(new gui.MenuItem({label: 'Session Manager', key: 'm', modifiers: 'ctrl', click: function(){
//     var manager = gui.Window.open('app://root/html/manager.html', {
//         "title": "Session Manager",
//         "toolbar": false,
//         "show_in_taskbar": false
//     });
//     manager.setAlwaysOnTop(true);
// }}));
// mnuFile.append(new gui.MenuItem({label: 'New Window', key: 'n', modifier: 'ctrl'}));
// mnuFile.append(new gui.MenuItem({label: 'New Query Tab', key: 't', modifier: 'ctrl'}));
// mnuFile.append(new gui.MenuItem({label: 'Load SQL File', key: 'o', modifier: 'ctrl'}));
// mnuFile.append(new gui.MenuItem({label: 'Quit', key: 'q', modifier: 'ctrl'}));

// // Edit menu
// var mnuEdit = new gui.Menu();
// mnuEdit.append(new gui.MenuItem({label: 'Copy'}));
// mnuEdit.append(new gui.MenuItem({label: 'Cut'}));
// mnuEdit.append(new gui.MenuItem({label: 'Paste'}));
// mnuEdit.append(new gui.MenuItem({type: 'separator'}));
// mnuEdit.append(new gui.MenuItem({label: 'Preferences'}));

// // Search menu
// var mnuSearch = new gui.Menu();
// mnuSearch.append(new gui.MenuItem({label: 'Find'}));
// mnuSearch.append(new gui.MenuItem({label: 'Find & Replace'}));

// // Tools menu
// var mnuTools = new gui.Menu();
// mnuTools.append(new gui.MenuItem({label: 'User Manager'}));
// mnuTools.append(new gui.MenuItem({label: 'Maintenance'}));
// mnuTools.append(new gui.MenuItem({label: 'Bulk Table Editor' }));
// mnuTools.append(new gui.MenuItem({type: 'separator'}));
// mnuTools.append(new gui.MenuItem({label: 'Export Database'}));
// mnuTools.append(new gui.MenuItem({label: 'Export Grid Rows'}));
// mnuTools.append(new gui.MenuItem({type: 'separator'}));
// mnuTools.append(new gui.MenuItem({label: 'Import CSV File'}));

// // Help menu
// var mnuHelp = new gui.Menu();
// mnuHelp.append(new gui.MenuItem({label: 'MySQL Help'}));
// mnuHelp.append(new gui.MenuItem({type: 'separator'}));
// mnuHelp.append(new gui.MenuItem({label: 'About'}));


// menu.append(new gui.MenuItem({label: 'File', submenu: mnuFile}));
// menu.append(new gui.MenuItem({label: 'Edit', submenu: mnuEdit}));
// menu.append(new gui.MenuItem({label: 'Search', submenu: mnuSearch}));
// menu.append(new gui.MenuItem({label: 'Tools', submenu: mnuTools}));
// menu.append(new gui.MenuItem({label: 'Help', submenu: mnuHelp}));

// gui.Window.get().menu = menu;
// gui.Window.get().showDevTools();

// Remove one item
// menu.removeAt(1);

// Popup as context menu
// menu.popup(10, 10);

// Iterate menu's items
// for (var i = 0; i < menu.items.length; ++i) {
//   console.log(menu.items[i]);
// }

// var gui = require('nw.gui');

// var win = gui.Window.open ('https://github.com', {
//     position: 'center',
//     width: 800,
//     height: 600,
//     show_in_taskbar: false
// });
// win.on ('loaded', function(){
//   // the native onload event has just occurred
//   var document = win.window.document;
// });

var manager = require('dbmanager');
var $ = require('jquery');
require('jquery-ui');

$(function () {
    $('.connections').resizable();
});
manager.connect();
manager.getDatabases(function (databases) {
    var div = $('<div class="root">');

    div.append('<div class="connection item">\
        <i class="fa fa-caret-down fa-lg fa-fw"></i>\
        <i class="fa fa-server fa-fw"></i>\
        My Connection\
    </div>');

    databases.forEach(function (name) {
        div.append('<div class="database-root" data-use="false" data-name="' + name + '">\
            <div class="database item">\
                <i class="fa fa-caret-right fa-lg fa-fw"></i>\
                <i class="fa fa-database fa-fw"></i> ' + name + '\
            </div><div class="database-items hide"></div></div>');
    });

    div.find('.database-items').each(function (item) {
        $(this).append('<div class="database-tables database-item item"><i class="fa fa-caret-right fa-lg fa-fw"></i><i class="fa fa-table fa-fw"></i> Tables</div><div class="database-tables-items hide"></div>');
        $(this).append('<div class="database-functions database-item item"><i class="fa fa-caret-right fa-lg fa-fw"></i><i class="fa fa-exchange fa-fw"></i> Functions</div><div class="database-item-item"></div>');
        $(this).append('<div class="database-procedures database-item item"><i class="fa fa-caret-right fa-lg fa-fw"></i><i class="fa fa-code fa-fw"></i> Procedures</div><div class="database-item-item"></div>');
        $(this).append('<div class="database-triggers database-item item"><i class="fa fa-caret-right fa-lg fa-fw"></i><i class="fa fa-cog fa-fw"></i> Triggers</div><div class="database-item-item"></div>');
        $(this).append('<div class="database-events database-item item"><i class="fa fa-caret-right fa-lg fa-fw"></i><i class="fa fa-bolt fa-fw"></i> Events</div><div class="database-item-item"></div>');
        $(this).append('<div class="database-views database-item item"><i class="fa fa-caret-right fa-lg fa-fw"></i><i class="fa fa-binoculars fa-fw"></i> Views</div><div class="database-item-item"></div>');
    });
    $('.connections .remotes').append(div);
});

$(document).on('keyup', '.filter-database input[type=text]', function (e) {
    e.preventDefault();
    filterDatabase($(this).val());
});

$(document).on('keyup', '.filter-table input[type=text]', function (e) {
    e.preventDefault();
    filterTable($(this).val());
});

// Click on a database
$(document).on('click', '.database', function (e) {
    var database = $(this).closest('.database-root');
    if (e.target === e.currentTarget) {
        openClose(database.children('.database-items'));
    }
    useDatabase(database);
});

$(document).on('click', '.database>i', function (e) {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
        openClose($(this).closest('.database-root').find('.database-items'));
    }
})

// Click on a show tables
$(document).on('click', '.database-tables, .database-tables>i', function (e) {
    var $this = $(this);
    var database = $this.closest('.database-root');
    var tableItems = database.find('.database-tables-items');
    if (database.attr('data-use') === 'false') {
        useDatabase(database, function () {
            if (e.target === e.currentTarget) {
                openClose(tableItems);
                getTables(tableItems);
            }
        });
    } else {
        if (e.target === e.currentTarget) {
            openClose(tableItems);
            getTables(tableItems);
        }
    }
});

// Select a table
$(document).on('click', '.database-table', function (e) {
    if (e.target === e.currentTarget) {
        var table = $(this).attr('data-name');
        var database = $(this).closest('.database-root');
        var $this = $(this);
        // If the database isn't selected selected then get the table
        if (database.attr('data-use') == 'false') {
            // 'use database'
            useDatabase(database, function () {
                // 'select * from table limit 1000'
                manager.getDataView(table, function (rows, fields) {
                    selectTable($this);
                    showTable(rows, fields);
                });
            });
        }
        // Already connected to the database select the table's data
        else {
            // 'select * from table limit 1000'
            manager.getDataView(table, function (rows, fields) {
                selectTable($this);
                showTable(rows, fields);
            });
        }
    }
});


function filterDatabase(inputval) {
    $('.root .database').each(function () {
        if ($(this).attr('data-name').toLowerCase().indexOf(inputval.toLowerCase()) === -1) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}

function filterTable(inputval) {
    $('.root .database-table').each(function () {
        if ($(this).attr('data-name').toLowerCase().indexOf(inputval.toLowerCase()) === -1) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}

function getTables(table) {
    var tables = table.closest('.database-root').find('.database-tables-items');
    if (tables.is(':has("div")')) {
        return;
    }
    manager.getTables(function (tbls) {
        tbls.forEach(function (item) {
            table.append('<div class="database-table item" data-name="' + item + '"><i class="fa fa-fw fa-table"></i> ' + item + '</div>');
        });
        filterTable($('.filter-table input[type=text]').val());
    });
}

function useDatabase(database, callback) {
    var name = database.attr('data-name');
    manager.useDatabase(name, function () {
        selectDatabase(database.children('.database'));
        database.attr('data-use', 'true');
        if (typeof callback === 'function') {
            callback();
        }
    });
}

function selectDatabase(item) {
    $('.database').attr('data-use', 'false').removeClass('active');
    if (typeof item !== 'undefined') {
        item.addClass('active');
    }
}

function selectTable(item) {
    $('.database-table').removeClass('active');
    item.addClass('active');
}

function openClose(root) {
    if (root.hasClass('hide')) {
        root.removeClass('hide');
        root.children('i.fa:first-child').removeClass('fa-caret-right').addClass('fa-caret-down');
    } else {
        root.addClass('hide');
        root.children('i.fa:first-child').removeClass('fa-caret-down').addClass('fa-caret-right');
    }
}

function showTable(rows, fields) {
    $('#results-table-data>tbody').html('');
    $('#results-table-header tr').html('');

    var columnTypes = [];
    var typeNames = manager.dataTypes();

    fields.forEach(function (field) {
        columnTypes.push({ dataType: typeNames[field.type], typeId: field.type });
        $('#results-table-header tr').append('<th>' + field.name + '</th>');
    });

    var tbody = $('#results-table-data>tbody');

    var rowsLength = rows.length;

    var data = [];

    for (var i = 0; i < rowsLength; i++) {
        var item = rows[i];
        // var row = $('<tr>');
        var row = '';
        for (var j = 0; j < fields.length; j++) {
            var field = fields[j].name;
            var value = item[field] === null ? '(null)' : item[field];
            // row.append('<td class="data-' + getTypeClass(columnTypes[j], item[field]) + '">' + value + '</td>');
            row += '<td class="data-' + getTypeClass(columnTypes[j], item[field]) + '">' + value + '</td>';
        }
        data.push(row);
        // tbody.append(row);
    }

    require('clusterize.js');
    // var clusterize = new Clusterize({
    //     rows: data,
    //     scrollId: 'scrollArea',
    //     contentId: 'contentArea'
    // });

    dataLoaded();
}

$(document).on('mousedown', '.results>.table-results>tbody>tr>td', function (event) {
    if (event.which == 1 || event.which == 3) {
        $('.results>.table-results>tbody>tr:nth-of-type(odd)').css({ 'background-color': '#383838' });
        $('.results>.table-results>tbody>tr:nth-of-type(even)').css({ 'background-color': '##2D2D2D' });
        $(this).parent().css({ 'background-color': '#585858' });
    }
});

function doScrollEvent(e) {
    var table = document.getElementById('results-table-header');
    table.style.left = -e.target.scrollLeft + 'px';
}

$(document).ready(function () {
    var container = document.getElementById('results-data');

    if (container.addEventListener) {
        container.addEventListener('scroll', doScrollEvent, false);
        window.addEventListener('resize', resizeHeaders, false);
    }
});

function dataLoaded() {
    resizeHeaders();
}

function resizeHeaders() {
    var firstRow = $('#results-table-data>tbody>tr:first-child');
    var headers = $('#results-table-header>tbody>tr:first-child');
    var tds = firstRow.children('td');

    for (var i = 0; i < tds.length; i++) {
        var td = tds.eq(i);
        headers.children('th').eq(i).css({ width: td.innerWidth() + 'px' })
    }
}

function getTypeClass(type, value) {
    if (value === null) {
        return 'null';
    }
    switch (type.dataType.toLowerCase()) {
        case 'null':
            return 'null';
        case 'decimal':
        case 'tiny':
        case 'short':
        case 'long':
        case 'float':
        case 'double':
        case 'int24':
        case 'longlong':
        case 'bit':
        case 'newdecimal':
            return 'number';
        case 'timestamp':
        case 'date':
        case 'time':
        case 'datetime':
        case 'year':
        case 'newdate':
            return 'date';
        case 'varchar':
        case 'char':
        case 'text':
        case 'tiny_blob':
        case 'medium_blob':
        case 'long_blob':
            return 'string';
        default:
            return 'string';
    }
}