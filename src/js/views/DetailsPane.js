/*
 A tab Pane can be linked to the feautre viewer, to display details or whatever you wish. Check example page.

 * Copyright (c) 2013, Genentech Inc.
 * All rights reserved.
 * Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology, Genentech
 */
define(['underscore', 'jquery', 'backbone', 'bootstrap', 'text!pviz_templates/details-pane.html'], function (_, $, bb, undefined, tmpl) {
    return bb.View.extend({
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
         * return a jquery elment for the tab pointed bby the given name
         * if no tab exist, a tab + menu are created
         * the obect return is a map with 'menuItem' and 'contents' elements
         * @param {Object} name
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

        /*
         * trim, lowercase and convert non character symbols to dash
         */
        name2id: function (name) {
            return name.trim().toLowerCase().replace(/\W+/g, '-');
        }
    });
});
