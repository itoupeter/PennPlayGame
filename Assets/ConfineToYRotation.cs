using UnityEngine;
using System.Collections;

public class ConfineToYRotation : MonoBehaviour {
    
	// Update is called once per frame
	public void FixedUpdate () {
        transform.eulerAngles = new Vector3( 
            0, transform.eulerAngles.y, 0
        );
	}
}
