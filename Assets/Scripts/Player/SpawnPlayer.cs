using UnityEngine;
using System.Collections;

public class SpawnPlayer : MonoBehaviour {

    private GameObject player2;

	// Use this for initialization
	void Start () {
        StartCoroutine( replay() );
	}

    IEnumerator replay() {
        yield return new WaitForSeconds( 0.5f );
	    player2 = GameObject.FindGameObjectWithTag( "Player2" );
        player2.GetComponent< RecordMovement >().StartReplay();
        player2.GetComponent< RecordOrientation >().StartReplay();
    }
}
