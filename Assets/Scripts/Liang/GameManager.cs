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

	public static void NextLife() {
		//hero.GetComponent<Rigidbody>().isKinematic = true;
		//hero.GetComponent<Rigidbody>().MovePosition(Vector3.zero);
		hero.transform.position = Vector3.zero;
	}
        
}
