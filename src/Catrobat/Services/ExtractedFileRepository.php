<?php

namespace App\Catrobat\Services;

use App\Catrobat\Exceptions\InvalidCatrobatFileException;
use App\Catrobat\Exceptions\InvalidStorageDirectoryException;
use App\Entity\Program;
use App\Entity\ProgramManager;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Finder\Finder;

/**
 * Class ExtractedFileRepository.
 */
class ExtractedFileRepository
{
  /**
   * @var
   */
  private $local_path;
  /**
   * @var
   */
  private $webpath;
  /**
   * @var
   */
  private $local_storage_path;
  /**
   * @var CatrobatFileExtractor
   */
  private $file_extractor;
  /**
   * @var ProgramManager
   */
  private $program_manager;
  /**
   * @var ProgramFileRepository
   */
  private $prog_file_repo;
  /**
   * @var LoggerInterface
   */
  private $l;

  /**
   * ExtractedFileRepository constructor.
   */
  public function __construct(ParameterBagInterface $parameter_bag, CatrobatFileExtractor $file_extractor,
                              ProgramManager $program_manager, ProgramFileRepository $prog_file_rep,
                              LoggerInterface $l)
  {
    $local_extracted_path = $parameter_bag->get('catrobat.file.extract.dir');
    $web_extracted_path = $parameter_bag->get('catrobat.file.extract.path');
    $local_storage_path = $parameter_bag->get('catrobat.file.storage.dir');

    if (!is_dir($local_extracted_path))
    {
      throw new InvalidStorageDirectoryException($local_extracted_path.' is not a valid directory');
    }
    $this->local_storage_path = $local_storage_path;
    $this->local_path = $local_extracted_path;
    $this->webpath = $web_extracted_path;
    $this->file_extractor = $file_extractor;
    $this->program_manager = $program_manager;
    $this->prog_file_repo = $prog_file_rep;
    $this->l = $l;
  }

  /**
   * @throws \Doctrine\ORM\ORMException
   * @throws \Doctrine\ORM\OptimisticLockException
   *
   * @return ExtractedCatrobatFile
   */
  public function loadProgramExtractedFile(Program $program)
  {
    try
    {
      $hash = $program->getExtractedDirectoryHash();

      return new ExtractedCatrobatFile($this->local_path.$hash.'/', $this->webpath.$hash.'/', $hash);
    }
    catch (InvalidCatrobatFileException $e)
    {
      //need to extract first
      unset($e);
    }

    try
    {
      $program_file = $this->prog_file_repo->getProgramFile($program->getId());
      $extracted_file = $this->file_extractor->extract($program_file);
      $program->setExtractedDirectoryHash($extracted_file->getDirHash());
      $this->program_manager->save($program);

      return $extracted_file;
    }
    catch (\Exception $e)
    {
      return null;
    }
  }

  /**
   * @throws \Doctrine\ORM\ORMException
   * @throws \Doctrine\ORM\OptimisticLockException
   */
  public function removeProgramExtractedFile(Program $program)
  {
    try
    {
      $hash = $program->getExtractedDirectoryHash();

      if (null != $hash)
      {
        $path = $this->local_path.$hash.'/';

        if (file_exists($this->local_path.$hash) && is_dir($path))
        {
          $finder = new Finder();

          $image_path = $path.'images/';
          if (file_exists($path.'images') && is_dir($image_path))
          {
            $finder->files()->in($image_path);
            foreach ($finder as $file)
            {
              unlink($image_path.$file->getFilename());
            }
            rmdir($image_path);
          }

          $finder = new Finder();

          $sound_path = $path.'sounds/';
          if (file_exists($path.'sounds') && is_dir($sound_path))
          {
            $finder->files()->in($sound_path);
            foreach ($finder as $file)
            {
              unlink($sound_path.$file->getFilename());
            }
            rmdir($sound_path);
          }
          /** @var Finder $finder */
          $finder = new Finder();
          $finder->files()->in($path);
          foreach ($finder as $file)
          {
            unlink($path.$file->getFilename());
          }

          rmdir($path);
        }

        $program->setExtractedDirectoryHash(null);
        $this->program_manager->save($program);
      }
    }
    catch (InvalidCatrobatFileException $e)
    {
      // do nothing
    }
  }
}
