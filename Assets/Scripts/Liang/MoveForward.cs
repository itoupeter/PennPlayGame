using UnityEngine;
using System.Collections;

public class MoveForward : MonoBehaviour {

    public float speed;

    // Use this for initialization
    void Start() {

    }

    // Update is called once per frame
    void Update() {

    }

    public void FixedUpdate() {
        transform.position = transform.position + speed * transform.forward;
    }
}
