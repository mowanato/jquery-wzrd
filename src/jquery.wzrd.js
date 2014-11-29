/*!
 * jQuery Wzrd Plugin v1.0.0
 * https://github.com/mowanato/jquery-wzrd
 *
 * Copyright 2014 Naritomo Moriwaki
 * Released under the MIT license
 */
(function ($) {
    var
    init = function(opts) {
        var
        self = this,
        
        pages = [],
        activePageIndex = -1,
        settings = $.extend({
            onPageChanging: null,
            onPageChanged: null,
            onFinished: null,
            initialIndex: 0,
            defaultAllPageClickable: false
        }, opts),
        
        $tabs = self.find('[wzrd-tabs]').children(),
        $prevButton = self.find('[wzrd-prev-button]'),
        $nextButton = self.find('[wzrd-next-button]'),
        $finishButton = self.find('[wzrd-finish-button]'),

        activate = function(newIndex) {
            var
            currentIndex = activePageIndex;
            
            if (settings.onPageChanging) {
                if (!settings.onPageChanging(currentIndex, newIndex)) return;
            }
            
            if (currentIndex >= 0) {
                if (currentIndex == newIndex) return;
                var currentPage = pages[currentIndex];
                $(currentPage.tab).removeClass('wzrd-active');
                $(currentPage.panel).removeClass('wzrd-active');
            }
            var newPage = pages[newIndex];
            newPage.clickable = true;
            $(newPage.tab).addClass('wzrd-clickable wzrd-active');
            $(newPage.panel).addClass('wzrd-active');
            activePageIndex = newIndex;

            $prevButton[newIndex == 0 ? 'removeClass' : 'addClass']('wzrd-clickable');
            $nextButton[newIndex == pages.length-1 ? 'removeClass' : 'addClass']('wzrd-clickable');
            $finishButton[newIndex != pages.length-1 ? 'removeClass' : 'addClass']('wzrd-clickable');
            
            if (settings.onPageChanged) {
                settings.onPageChanged(currentIndex, newIndex);
            }
        };

        $tabs.each(function (index, elem){
            var
            $tab = $(elem),
            $panel = $($tab.attr('wzrd-target-panel')),
            page = {
                index: index,
                tab: $tab.get(0),
                panel: $panel.get(0),
                clickable: settings.defaultAllPageClickable || index < settings.initialIndex
            }
            if (page.clickable) {
                $tab.addClass('wzrd-clickable');
            }
            $tab.on('click', function() {
                if (!page.clickable) return;
                activate(index);
            });
            pages.push(page);
        });
        $prevButton.on('click', function() {
            if ($prevButton.hasClass('wzrd-clickable')) {
                activate(activePageIndex - 1);
            }
            return false;
        });
        $nextButton.on('click', function() {
            if ($nextButton.hasClass('wzrd-clickable')) {
                activate(activePageIndex + 1);
            }
            return false;
        });
        $finishButton.on('click', function() {
            if ($finishButton.hasClass('wzrd-clickable')) {
                if (settings.onFinished) settings.onFinished();
            }
            return false;
        });
        activate(settings.initialIndex);
    };
    $.fn.wzrd = function(opts) {
        return this.each(function() {
            init.call($(this), opts);
        });
    };
}(jQuery));
