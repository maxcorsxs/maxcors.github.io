(function () {
    'use strict';

    console.log('Franchise Plugin starting...');

    // Ждем загрузки Lampa
    function waitForLampa() {
        if (typeof Lampa !== 'undefined' && Lampa.ready) {
            console.log('Lampa is ready, initializing franchise plugin...');
            initFranchisePlugin();
        } else {
            console.log('Waiting for Lampa...');
            setTimeout(waitForLampa, 1000);
        }
    }

    function initFranchisePlugin() {
        try {
            // Способ 1: Добавляем в главное меню
            if (Lampa.Menu) {
                console.log('Adding to main menu...');
                Lampa.Menu.add({
                    title: 'Франшизы',
                    icon: '🎬',
                    onSelect: showFranchises
                });
                console.log('Added to main menu successfully');
            }

            // Способ 2: Добавляем в настройки
            if (Lampa.Settings) {
                console.log('Adding to settings...');
                Lampa.Settings.add({
                    component: 'franchise',
                    name: 'Франшизы',
                    icon: '🎬',
                    onSelect: showFranchises
                });
                console.log('Added to settings successfully');
            }

            // Способ 3: Создаем кнопку на главном экране
            setTimeout(function() {
                try {
                    console.log('Creating main screen button...');
                    var button = $('<div class="card selector" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 20px; border-radius: 10px; cursor: pointer; margin: 10px;">');
                    button.html('<div style="font-size: 24px; margin-bottom: 10px;">🎬</div><div style="font-weight: bold;">Франшизы</div><div style="font-size: 12px; opacity: 0.8;">Коллекции фильмов</div>');
                    
                    button.on('click', function() {
                        console.log('Franchise button clicked');
                        showFranchises();
                    });
                    
                    // Ищем место для кнопки
                    var container = $('.start__body, .main, body');
                    if (container.length) {
                        container.first().append(button);
                        console.log('Button added to screen');
                    } else {
                        console.log('Container not found for button');
                    }
                } catch (e) {
                    console.error('Error creating button:', e);
                }
            }, 3000);

            // Способ 4: Добавляем в быстрый доступ
            if (Lampa.Arrays && Lampa.Arrays.extend) {
                console.log('Adding to arrays...');
                try {
                    Lampa.Arrays.extend({
                        franchise: {
                            title: 'Франшизы',
                            onSelect: showFranchises
                        }
                    });
                } catch (e) {
                    console.log('Could not extend arrays:', e);
                }
            }

            console.log('Franchise Plugin initialized successfully');
            
        } catch (e) {
            console.error('Error initializing franchise plugin:', e);
        }
    }

    function showFranchises() {
        console.log('Showing franchises...');
        
        try {
            // Создаем простой интерфейс
            var html = `
                <div style="padding: 20px; background: #1a1a1a; color: white; min-height: 100vh;">
                    <h2 style="color: #667eea; margin-bottom: 20px;">🎬 Франшизы фильмов</h2>
                    <p style="margin-bottom: 20px;">Загрузка коллекций фильмов из TMDB...</p>
                    <div id="franchises-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                        <div style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 30px; margin-bottom: 10px;">⏳</div>
                            <div>Загрузка...</div>
                        </div>
                    </div>
                    <button onclick="this.parentElement.remove()" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">Закрыть</button>
                </div>
            `;
            
            // Показываем модальное окно
            if (Lampa.Modal) {
                Lampa.Modal.open({
                    title: 'Франшизы',
                    html: html,
                    size: 'large'
                });
            } else {
                // Fallback - просто добавляем на страницу
                $('body').append('<div id="franchise-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center;">' + html + '</div>');
            }
            
            // Загружаем данные
            loadFranchisesData();
            
        } catch (e) {
            console.error('Error showing franchises:', e);
            alert('Ошибка при загрузке франшиз: ' + e.message);
        }
    }

    function loadFranchisesData() {
        console.log('Loading franchises data...');
        
        // Имитация загрузки данных
        setTimeout(function() {
            var franchises = [
                { name: 'Marvel Cinematic Universe', parts: 32, icon: '🦸' },
                { name: 'Star Wars', parts: 12, icon: '⚔️' },
                { name: 'Harry Potter', parts: 8, icon: '⚡' },
                { name: 'Fast & Furious', parts: 10, icon: '🏎️' },
                { name: 'James Bond', parts: 25, icon: '🎩' },
                { name: 'The Lord of the Rings', parts: 6, icon: '💍' }
            ];
            
            var html = '';
            franchises.forEach(function(franchise) {
                html += `
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px; border-radius: 8px; text-align: center; cursor: pointer;" onclick="alert('Франшиза: ${franchise.name}\\nЧастей: ${franchise.parts}')">
                        <div style="font-size: 30px; margin-bottom: 10px;">${franchise.icon}</div>
                        <div style="font-weight: bold; margin-bottom: 5px;">${franchise.name}</div>
                        <div style="font-size: 12px; opacity: 0.8;">${franchise.parts} частей</div>
                    </div>
                `;
            });
            
            var list = $('#franchises-list');
            if (list.length) {
                list.html(html);
                console.log('Franchises loaded successfully');
            }
        }, 2000);
    }

    // Запускаем плагин
    if (typeof Lampa !== 'undefined') {
        waitForLampa();
    } else {
        console.log('Lampa not found, waiting...');
        setTimeout(waitForLampa, 2000);
    }

    // Добавляем глобальную функцию для теста
    window.showFranchises = showFranchises;
    console.log('Franchise Plugin loaded. Test with: showFranchises()');

})();
