using UnityEngine;
using System.Collections;

namespace CompleteProject {
	public class SimpleFPSAI : MonoBehaviour {

		public GameObject hero;
		Transform player;
		PlayerHealth playerHealth;      // Reference to the player's health.
		NavMeshAgent nav;               // Reference to the nav mesh agent.

		// Use this for initialization
		void Start() {
			hero = GameObject.Find("Hero");
			player = hero.transform.FindChild("Main Camera").transform.FindChild("Player").transform;
			playerHealth = player.GetComponent<PlayerHealth>();
			nav = GetComponent<NavMeshAgent>();
		}

		// Update is called once per frame
		void Update() {
			if (playerHealth.currentHealth > 0 && gameObject.tag == "Player2") {
				Vector3 dir = hero.transform.position - transform.position;
				dir = dir.normalized * 2;
				nav.SetDestination(hero.transform.position - dir);

				Vector3 enemyDir = playerHealth.nearestEnemy.transform.position - transform.position;
				transform.LookAt(enemyDir);
			} else {
				nav.enabled = false;
			}
		}
	}

}