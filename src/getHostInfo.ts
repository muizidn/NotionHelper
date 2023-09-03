export interface HostInfo {
    location: string;
}


export default async function getHostInfo(): Promise<HostInfo> {
    return new Promise<HostInfo>((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];

            function _getHostInfo() {
                (async () => {
                    const response = await chrome.runtime.sendMessage({ info: window.location.pathname });
                    console.log(response);
                })();
            }

            chrome.scripting.executeScript({
                target: { tabId: activeTab.id! },
                func: _getHostInfo,
            }).then(() => console.log('Injected a function!'));
        });

        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            const senderTab = sender.tab;
            const resp = request.info;

            if (resp) {
                resolve({
                    location: resp
                })
                sendResponse({ farewell: "thanks for sending! goodbye " + senderTab?.title });
            }
        });
    })
}