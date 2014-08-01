define(
    /**
     @exports DetailsPane
     @author Alexandre Masselot
     @author Kiran Mukhyala
     @copyright 2013,  Bioinformatics & Computational Biology Department, Genentech Inc.
     */

    ['underscore', 'jquery', 'backbone', 'bootstrap', 'text!pviz_templates/details-pane.html'], function (_, $, bb, undefined, tmpl) {
        /**
         * @class DetailsPane is a multi tab container to eventually display details from the highlighted features. It is synchronized with the sequence viewer
         * @constructor
         * @augments Backbone.View
         */
        var DetailsPane = bb.View.extend(
            /**
             * @lends module:DetailsPane~DetailsPane.prototype
             */{
                initialize: function (options) {
                    var self = this;
                    self.options = options;

                    var el = $(self.el);
                    el.empty();
                    el.append($(tmpl));

                    self.containers = {
                        menu: el.find('ul'),
                        tabs: el.find('div.tab-content'),
                        divRaiseActive: el.find('div.nav')
                    }

                    self.templates = {
                        menuItem: '<li><a href="#<%=id%>" data-toggle="tab"><%=name%></a></li>',
                        contents: '<div class="tab-pane" id="<%=id%>"></div>'
                    }

                    self.tabs = {};
                },
                render: function () {
                    var self = this;

                    return self;
                },
                /**
                 * return a jquery element for the tab pointed bby the given name
                 * if no tab exist, a tab + menu are created
                 * the obect return is a map with 'menuItem' and 'contents' elements
                 * @param {String} name
                 */
                getTab: function (name) {
                    var self = this;
                    var tid = self.name2id(name);
                    if (self.tabs[tid] === undefined) {
                        var emi = $(_.template(self.templates.menuItem, {
                            name: name,
                            id: tid
                        }))
                        emi.find('a').click(function (e) {
                            e.preventDefault();
                            $(this).tab('show');
                        })
                        var ec = $(_.template(self.templates.contents, {
                            name: name,
                            id: tid
                        }))

                        self.containers.menu.append(emi);
                        self.containers.tabs.append(ec);

                        self.tabs[tid] = {
                            menuItem: emi,
                            contents: ec
                        };
                        if (_.size(self.tabs) >= 2) {
                            self.containers.divRaiseActive.show();
                        }
                    }
                    return self.tabs[tid];
                },
                /**
                 * raise a tab (make it visible)
                 * @param {element} tab
                 */
                raiseTab: function (tab) {
                    var self = this;
                    tab.menuItem.find('a').tab('show')
                },
                /**
                 * raise the tab if the "raise-active" checkbox is set
                 */
                focusOnTab: function (tab) {
                    var self = this;
                    if (tab.menuItem.hasClass('active')) {
                        return
                    }
                    if ($(self.el).find('input#raise-active').is(':checked')) {
                        self.raiseTab(tab)
                        return
                    }

                    tab.menuItem.animate({
                        opacity: 0.1
                    }, 100, function () {
                        tab.menuItem.animate({
                            opacity: 1.0
                        }, 100)
                    })
                },

                /**
                 * trim, lowercase and convert non character symbols to dash
                 * @private
                 * @param {String} name
                 */
                name2id: function (name) {
                    return name.trim().toLowerCase().replace(/\W+/g, '-');
                }
            });
        return DetailsPane;
    });
