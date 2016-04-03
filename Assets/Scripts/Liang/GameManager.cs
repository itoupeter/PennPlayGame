using UnityEngine;
using System.Collections;
using CompleteProject;

public class GameManager : MonoBehaviour {

    public static GameObject player;
	public static GameObject hero;
	public static GameObject[] heroes;
	PlayerHealth playerHealth;

	// Use this for initialization
	void Start () {
        player = GameObject.FindGameObjectWithTag("Player");
		hero = GameObject.FindGameObjectWithTag("Hero");
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

	public static void NextLife() {
		hero.GetComponent<Rigidbody>().MovePosition(Vector3.zero);
	}
        
}
