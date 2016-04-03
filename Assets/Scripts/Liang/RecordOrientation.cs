using UnityEngine;
using System;
using System.Collections;

#if UNITY_WINRT
using File = UnityEngine.Windows.File;
#else
using File = System.IO.File;
#endif

public class RecordOrientation : MonoBehaviour {

    public string recordName;

    private bool isRecording;
    private int recordIndex;
    private float recordStart;
    private float recordLast;
    private int recordSize;
    private float[] recordData;
    private byte[] recordByte;
    private bool isReplaying;
    private int replayIndex;
    private float replayStart;
    private float replayLast;
    private Quaternion startOrientation;
    private Quaternion endOrientation;

    // Use this for initialization
    void Start() {
        isRecording = false;
        isReplaying = false;
        recordSize = 100000;
        recordData = new float[ recordSize * 5 ];
        recordByte = new byte[ recordSize * 20 ];
    }

    // Update is called once per frame
    void Update() {
        
        //---record time and orientation about every 200ms---
        if( isRecording ) {

            if( recordLast + 0.1f < Time.time - recordStart ) {
                recordLast = Time.time - recordStart;
                recordData[ recordIndex * 5 ] = recordLast;
                recordData[ recordIndex * 5 + 1 ] = transform.rotation.w;
                recordData[ recordIndex * 5 + 2 ] = transform.rotation.x;
                recordData[ recordIndex * 5 + 3 ] = transform.rotation.y;
                recordData[ recordIndex * 5 + 4 ] = transform.rotation.z;
                ++recordIndex;
            }
        }

        //---replay by interpolating orientation---
        if( isReplaying ) {

            if( recordData[ replayIndex * 5 ] < 0 ) {
                Debug.Log( "Stop replaying..." );
                isReplaying = false;
            }else {
                if( Time.time - replayStart > recordData[ replayIndex * 5 ] ) {
                    ++replayIndex;
                    startOrientation = endOrientation;
                    endOrientation = new Quaternion( 
                        recordData[ replayIndex * 5 + 2 ], 
                        recordData[ replayIndex * 5 + 3 ], 
                        recordData[ replayIndex * 5 + 4 ], 
                        recordData[ replayIndex * 5 + 1 ]
                        );
                }
            }

            if( isReplaying && replayIndex > 0 ) {
                float t = ( Time.time - replayStart - recordData[ ( replayIndex - 1 ) * 5 ] ) 
                    / ( ( recordData[ replayIndex * 5 ] ) - ( recordData[ ( replayIndex - 1 ) * 5 ] ) );

                transform.rotation = Quaternion.Lerp( startOrientation, endOrientation, t );
            }
        }
    }

    public void StartRecord() {

        Debug.Log( "Start recording orientation..." );

        if( recordName == null ) {
            Debug.LogError( "Record file not specified!" );
            return;
        }

        isRecording = true;
        recordStart = Time.time;
        recordLast = 0.0f;
        recordData[ 0 ] = 0.0f;
        recordData[ 1 ] = transform.rotation.w;
        recordData[ 2 ] = transform.rotation.x;
        recordData[ 3 ] = transform.rotation.y;
        recordData[ 4 ] = transform.rotation.z;
        recordIndex = 1;
    }

    public void StopRecord() {

        Debug.Log( "Stop recording..." );

        isRecording = false;
        recordData[ recordIndex * 5 ] = -1.0f;
        Buffer.BlockCopy( recordData, 0, recordByte, 0, recordSize * 20 );
        File.WriteAllBytes( recordName + ".rec", recordByte );
    }
    
    public void StartReplay() {

        Debug.Log( "Start replaying..." );
        
        isReplaying = true;
        recordByte = File.ReadAllBytes( recordName + ".rec" );
        Buffer.BlockCopy( recordByte, 0, recordData, 0, recordSize * 20 );
        replayStart = Time.time;
        replayLast = 0.0f;
        transform.rotation = new Quaternion( recordData[ 2 ], recordData[ 3 ], recordData[ 4 ], recordData[ 1 ] );
        endOrientation = transform.rotation;
        replayIndex = 0;
    }
}
