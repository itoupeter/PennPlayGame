using UnityEngine;
using System.Collections;

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
        recordSize = 10000;
        recordData = new float[ 10000 * 5 ];
        recordByte = new byte[ 10000 * 20 ];
    }

    // Update is called once per frame
    void Update() {
        
        //---record time and position about every 200ms---
        if( isRecording ) {

            if( recordLast + 0.5f< Time.time - recordStart ) {
                recordLast = Time.time - recordStart;
                recordData[ recordIndex * 5 ] = recordLast;
                recordData[ recordIndex * 5 + 1 ] = transform.rotation.w;
                recordData[ recordIndex * 5 + 2 ] = transform.rotation.x;
                recordData[ recordIndex * 5 + 3 ] = transform.rotation.y;
                recordData[ recordIndex * 5 + 4 ] = transform.rotation.z;
                ++recordIndex;
            }
        }

        //---replay by interpolating position---
        if( isReplaying ) {

            if( recordData[ replayIndex * 5 ] < 0 ) {
                Debug.Log( "Stop replaying..." );
                isReplaying = false;
            }else {
                if( Time.time - replayStart > recordData[ replayIndex * 5 ] ) {
                    ++replayIndex;
                    startOrientation = endOrientation;
                    endOrientation = new Quaternion( 
                        recordData[ replayIndex * 5 + 1 ], 
                        recordData[ replayIndex * 5 + 2 ], 
                        recordData[ replayIndex * 5 + 3 ], 
                        recordData[ replayIndex * 5 + 4 ]
                        );
                }
            }

            if( isReplaying ) {
                float t = ( Time.time - replayStart - recordData[ replayIndex - 1 << 2 ] ) 
                    / ( ( recordData[ replayIndex << 2 ] ) - ( recordData[ replayIndex - 1 << 2 ] ) );

                transform.position = Vector3.Lerp( startPosition, endPosition, t );
            }
        }
    }

    public void StartRecord() {

        Debug.Log( "Start recording..." );

        if( recordName == null ) {
            Debug.LogError( "Record file not specified!" );
            return;
        }

        isRecording = true;
        recordStart = Time.time;
        recordLast = 0.0f;
        recordData[ 0 ] = 0.0f;
        recordData[ 1 ] = transform.position.x;
        recordData[ 2 ] = transform.position.y;
        recordData[ 3 ] = transform.position.z;
        recordIndex = 1;
    }

    public void StopRecord() {

        Debug.Log( "Stop recording..." );

        isRecording = false;
        recordData[ recordIndex << 2 ] = -1.0f;
        Buffer.BlockCopy( recordData, 0, recordByte, 0, recordSize << 4 );
        File.WriteAllBytes( recordName + ".rec", recordByte );
    }
    
    public void StartReplay() {

        Debug.Log( "Start replaying..." );
        
        isReplaying = true;
        recordByte = File.ReadAllBytes( recordName + ".rec" );
        Buffer.BlockCopy( recordByte, 0, recordData, 0, recordSize << 4 );
        replayStart = Time.time;
        replayLast = 0.0f;
        transform.position = new Vector3( recordData[ 1 ], recordData[ 2 ], recordData[ 3 ] );
        endPosition = transform.position;
        replayIndex = 0;
    }
}
