<?php
namespace Catrobat\AppBundle\Controller\Api;

use Catrobat\AppBundle\Entity\ProgramManager;
use Catrobat\AppBundle\Responses\TemplateListResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Catrobat\AppBundle\Services\ScreenshotRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Catrobat\AppBundle\Responses\ProgramListResponse;

class TemplatesListController extends Controller
{

    /**
     * @Route("/api/templates/list.json", name="api_template_list", defaults={"_format": "json"}, methods={"GET"})
     */
    public function listTemplatesAction(Request $request) {
        $template_manager = $this->get('templatemanager');

        $templates = $template_manager->findAllActive();

        return new TemplateListResponse($templates);
    }

}
