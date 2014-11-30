/*!
 * jQuery Wzrd Plugin
 * https://github.com/mowanato/jquery-wzrd
 *
 * Copyright 2014 Naritomo Moriwaki
 * Released under the MIT license
 */
(function ($) {
    var
    attrs = {
        tabs: 'data-wzrd-tabs',
        prevButton: 'data-wzrd-prev-button',
        nextButton: 'data-wzrd-next-button',
        finishButton: 'data-wzrd-finish-button',
        targetPanel: 'data-wzrd-target-panel'
    },
    classNames = {
        active: 'wzrd-active',
        clickable: 'wzrd-clickable'
    },
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
        
        $tabs = self.find('[' + attrs.tabs + ']').children(),
        $prevButton = self.find('[' + attrs.prevButton + ']'),
        $nextButton = self.find('[' + attrs.nextButton + ']'),
        $finishButton = self.find('[' + attrs.finishButton + ']'),

        activate = function(newIndex) {
            var
            currentIndex = activePageIndex;
            
            if (settings.onPageChanging) {
                if (!settings.onPageChanging(currentIndex, newIndex)) return;
            }
            
            if (currentIndex >= 0) {
                if (currentIndex == newIndex) return;
                var currentPage = pages[currentIndex];
                $(currentPage.tab).removeClass(classNames.active);
                $(currentPage.panel).removeClass(classNames.active);
            }
            var newPage = pages[newIndex];
            newPage.clickable = true;
            $(newPage.tab).addClass(classNames.clickable + ' ' + classNames.active);
            $(newPage.panel).addClass(classNames.active);
            activePageIndex = newIndex;

            $prevButton[newIndex == 0 ? 'removeClass' : 'addClass'](classNames.clickable);
            $nextButton[newIndex == pages.length-1 ? 'removeClass' : 'addClass'](classNames.clickable);
            $finishButton[newIndex != pages.length-1 ? 'removeClass' : 'addClass'](classNames.clickable);
            
            if (settings.onPageChanged) {
                settings.onPageChanged(currentIndex, newIndex);
            }
        };

        $tabs.each(function (index, elem){
            var
            $tab = $(elem),
            $panel = $($tab.attr(attrs.targetPanel)),
            page = {
                index: index,
                tab: $tab.get(0),
                panel: $panel.get(0),
                clickable: settings.defaultAllPageClickable || index < settings.initialIndex
            }
            if (page.clickable) {
                $tab.addClass(classNames.clickable);
            }
            $tab.on('click', function() {
                if (!page.clickable) return;
                activate(index);
            });
            pages.push(page);
        });
        $prevButton.on('click', function() {
            if ($prevButton.hasClass(classNames.clickable)) {
                activate(activePageIndex - 1);
            }
            return false;
        });
        $nextButton.on('click', function() {
            if ($nextButton.hasClass(classNames.clickable)) {
                activate(activePageIndex + 1);
            }
            return false;
        });
        $finishButton.on('click', function() {
            if ($finishButton.hasClass(classNames.clickable)) {
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
