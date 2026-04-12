using UnityEngine;

namespace TowerDefense.Core.Bootstrap
{
    public sealed class MilestoneRuntimeBootstrap : MonoBehaviour
    {
        [SerializeField] private PrototypeSceneRoots sceneRoots;
        [SerializeField] private bool logStartup = true;

        public PrototypeSceneRoots SceneRoots => sceneRoots;

        private void Awake()
        {
            if (sceneRoots == null)
            {
                TryGetComponent(out sceneRoots);
            }

            if (logStartup)
            {
                Debug.Log("Milestone runtime bootstrap initialized.", this);
            }
        }
    }
}
