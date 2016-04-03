using UnityEngine;
using System.Collections;

public class GameManager : MonoBehaviour {

    private GameObject player;

	// Use this for initialization
	void Start () {
        player = GameObject.FindGameObjectWithTag( "Player" );
	}
	
	// Update is called once per frame
	void Update () {
	    
        if( Input.GetKeyDown( KeyCode.F ) ) {
            player.GetComponent<RecordMovement>().StartRecord();
            player.GetComponent<RecordOrientation>().StartRecord();
        }

        if( Input.GetKeyUp( KeyCode.F ) ) {
            player.GetComponent<RecordMovement>().StopRecord();
            player.GetComponent<RecordOrientation>().StopRecord();
        }

        if( Input.GetKeyDown( KeyCode.G ) ) {
            player.GetComponent<RecordMovement>().StartReplay();
            player.GetComponent<RecordOrientation>().StartReplay();
        }

    }
        
}
