import React from 'react'

type Props = {}

function LoadAudio({ }: Props) {
    const loadFromIndexedDB = (fileName: any) => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('audioDatabase2', 1);

            request.onsuccess = (event: any) => {
                const db = event.target.result;
                const transaction = db.transaction('audioFiles', 'readonly');
                const store = transaction.objectStore('audioFiles');
                const getRequest = store.get(fileName);

                getRequest.onsuccess = () => {
                    if (getRequest.result) {
                        const fileData = getRequest.result.fileData;
                        const audioUrl = URL.createObjectURL(fileData);
                        resolve(audioUrl);
                    } else {
                        reject("File not found in IndexedDB");
                    }
                };

                getRequest.onerror = () => {
                    reject("Error retrieving file from IndexedDB");
                };
            };

            request.onerror = () => {
                reject("Error opening IndexedDB");
            };
        });
    };
    const playAudioFromIndexedDB = async (fileName: any) => {
        try {
            const audioUrl: any = await loadFromIndexedDB(fileName);
            const audio = new Audio(audioUrl);
            audio.play();
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div>
            <button onClick={() => playAudioFromIndexedDB("Normal1_extract_1.wav")}>KUY</button>
        </div>
    )
}

export default LoadAudio