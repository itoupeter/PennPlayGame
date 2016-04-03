using UnityEngine;
using System.Collections;

public class RecordPlayer1 : MonoBehaviour {

    private GameObject player;

	// Use this for initialization
	void Start () {
        StartCoroutine( record() );
	}
	
    IEnumerator record() {
        yield return new WaitForSeconds( 0.5f );
	    player = GameObject.FindGameObjectWithTag( "Player" );
        player.GetComponent< RecordMovement >().StartRecord();
        player.GetComponent< RecordOrientation >().StartRecord();
    }
}
