const butInstall = document.getElementById('buttonInstall');


butInstall.style.display = 'none'
// Logic for installing the PWA
// TODO: Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', function(event) {
    event.preventDefault();
    console.log(event)
    console.log('👍', 'beforeinstallprompt', event);
    // Store the triggered events
    window.deferredPrompt = event;
    butInstall.style.display = null
});

// TODO: Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async function() {
    const promptEvent = window.deferredPrompt;
    // console.log(promptEvent)
    if (!promptEvent) {
        return;
    }
    // Show prompt
    promptEvent.prompt();
    //console.log('👍', 'userChoice', result);
    // Reset the deferred prompt variable, it can only be used once.
    window.deferredPrompt = null;
});

window.addEventListener('appinstalled', function(event) {
    // Clear prompt
    console.log('👍', 'appinstalled', event);
    window.deferredPrompt = null;
    butInstall.style.display = 'none'
}); 
